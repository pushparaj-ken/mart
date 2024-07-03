const catchAsync = require('../../utils/catchAsync');
const logger1 = require('../../config/logger');
const Services = require('../../services/excel')
const imageUpload = require('../../services/image_upload.service')
const Brand = require('../../model/brands')
const foldername = "Brand";

const AddBrand = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const files = req.files;
    if (values.name != '' && values.name != null && values.name != undefined) {
      const BrandDetais = await Brand.findOne({ status: 0, name: values.name })
      if (BrandDetais != null) {
        res.send({
          code: 201,
          success: false,
          status: "BrandName Already Exists!.",
          timestamp: new Date()
        });
      } else {
        let image_new = "";
        if (files.image) {
          let { buffer, originalname } = files.image[0];
          let image = await imageUpload.upload(buffer, originalname, foldername);
          console.log(image.Location);
          image_new = image.Location;
        } else {
          image_new = image_new;
        }
        const Data = {
          name: values.name,
          store_id: values.store_id,
          image: image_new,
          description: values.description,
          orderBy: values.orderBy,
          createdBy: req.userdetails.name,
        }
        Brand(Data).save().then((Result) => {
          res.send({
            success: true,
            code: 200,
            status: "Data Saved Success",
          });
        }).catch((err) => {
          logger1.errorWithLineNumber('An error occurred:', err);
          console.error('Database Error');
          console.error(err);
          res.send({
            success: false,
            code: 201,
            status: err.stack,
            Data: {},
            "timestamp": new Date()
          });
        })
      }
    } else {
      res.send({
        code: 201,
        success: false,
        status: "All Fields are Mandatory",
        timestamp: new Date()
      });
    }
  } catch (err) {
    logger1.errorWithLineNumber('An error occurred:', err);
    console.error('Database Error');
    console.error(err);
    res.send({
      success: false,
      code: 201,
      status: err.stack,
      Data: {},
      "timestamp": new Date()
    });
  }
});

const UpdateBrand = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const files = req.files;
    const params = req.params;
    if (params.id != '' && params.id != null && params.id != undefined) {
      let image_new = values.image;
      if (files.image) {
        let { buffer, originalname } = files.image[0];
        let image = await imageUpload.upload(buffer, originalname, foldername);
        console.log(image.Location);
        values.image = image.Location;
      } else {
        values.image = image_new;
      }
      values.updatedBy = req.userdetails.name
      const query = {
        id: params.id
      }
      const changes = {
        $set: values
      }
      Brand.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
        res.send({
          success: true,
          code: 200,
          status: "Data Saved Success",
          timestamp: new Date()
        });
      }).catch((err) => {
        //emailError.sendErrorEmail(err.stack, req.body, req.originalUrl);
        logger1.errorWithLineNumber('An error occurred:', err);
        res.send({
          code: 201,
          success: false,
          status: err.stack,
          timestamp: new Date()
        });
      })
    } else {
      res.send({
        code: 201,
        success: false,
        status: "Id required to Update Store.",
        timestamp: new Date()
      });
    }
  } catch (err) {
    logger1.errorWithLineNumber('An error occurred:', err);
    console.error('Database Error');
    console.error(err);
    res.send({
      success: false,
      code: 201,
      status: err.stack,
      Data: {},
      "timestamp": new Date()
    });
  }
});

const DeleteBrand = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const files = req.files;
    const params = req.params;
    if (params.id != '' && params.id != null && params.id != undefined) {
      values.updatedBy = req.userdetails.name
      const query = {
        id: params.id
      }
      const changes = {
        $set: values
      }
      Brand.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
        res.send({
          success: true,
          code: 200,
          status: "Data Saved Success",
          timestamp: new Date()
        });
      }).catch((err) => {
        //emailError.sendErrorEmail(err.stack, req.body, req.originalUrl);
        logger1.errorWithLineNumber('An error occurred:', err);
        res.send({
          code: 201,
          success: false,
          status: err.stack,
          timestamp: new Date()
        });
      })
    } else {
      res.send({
        code: 201,
        success: false,
        status: "Id required to Update Store.",
        timestamp: new Date()
      });
    }
  } catch (err) {
    logger1.errorWithLineNumber('An error occurred:', err);
    console.error('Database Error');
    console.error(err);
    res.send({
      success: false,
      code: 201,
      status: err.stack,
      Data: {},
      "timestamp": new Date()
    });
  }
});

const ListBrand = catchAsync(async (req, res) => {
  try {
    let values = req.query
    let query = {}
    if (values.id != '' && values.id != null && values.id != undefined) {
      query.id = values.id
    }
    if (values.name != '' && values.name != null && values.name != undefined) {
      query.name = { $regex: values.name, $options: "i" }
    }
    if (values.status != '' && values.status != null && values.status != undefined) {
      query.status = parseInt(values.status)

    }

    const totalpage = await Brand.countDocuments(query)
    const pipeline = [];
    let skip = 0;
    let page1 = values.page - 1;
    if (values.hasOwnProperty("page") && values.page !== '' && values.page !== undefined && values.page !== null) {
      if (page1 > 0) {
        skip = skip + (parseInt(values.limit) * page1);
        const skipstage = {
          $skip: skip
        }
        pipeline.push(skipstage)
      }
    }
    if (values.limit !== undefined && values.limit !== null) {
      const limit = {
        $limit: parseInt(values.limit)
      }
      pipeline.push(limit)
    }

    pipeline.unshift(
      {
        $match: query
      },
      {
        $lookup: {
          from: "stores",
          localField: "store_id",
          foreignField: "id",
          as: "StoresDetails"
        }
      },
      {
        $project: {
          id: 1,
          Name: "$name",
          image: 1,
          Store_id: "$store_id",
          StoreName: {
            $arrayElemAt: ["$StoresDetails.name", 0],
          },
          Description: "$description",
          status: 1,
          Status: {
            $cond: {
              if: { $eq: ["$status", 0] },
              then: "Active",
              else: "In Active"
            }
          },
          orderBy: "$orderBy",
          CreatedBy: "$createdBy",
          UpdatedBy: "$updatedBy",
          CreatedAt: {
            $dateToString: {
              format: "%d-%m-%Y %H:%M:%S",
              date: {
                $toDate: {
                  $dateToString: {
                    format: "%Y-%m-%dT%H:%M:%S.%LZ",
                    date: "$createdAt",
                    timezone: "Asia/Kolkata", // Set the desired timezone (India Standard Time)
                  },
                },
              }, // Convert string to date using $toDate
            },
          },
          UpdatedAt: {
            $dateToString: {
              format: "%d-%m-%Y %H:%M:%S",
              date: {
                $toDate: {
                  $dateToString: {
                    format: "%Y-%m-%dT%H:%M:%S.%LZ",
                    date: "$updatedAt",
                    timezone: "Asia/Kolkata", // Set the desired timezone (India Standard Time)
                  },
                },
              }, // Convert string to date using $toDate
            },
          },
          _id: 0,
        }
      }
    );
    const Results = await Brand.aggregate(pipeline);
    if (Results.length > 0) {
      const Records = Results.map(({ id, status, Store_id, ...rest }) => rest);
      let filePath = await Services.ExportCommonExcel(Records, "Brand_list");
      var fullPublicUrl = process.env.fullPublicUrl;
      let downloadurl = `${fullPublicUrl}${filePath}`
      res.send({
        success: true,
        code: 200,
        status: "Brands Lists retrieved successfully",
        downloadurl: downloadurl,
        totalpage: totalpage,
        Data: Results,
        "timestamp": new Date()
      });
    } else {
      res.send({
        success: false,
        code: 201,
        status: "No Records Found!",
        totalpage: 0,
        Data: [],
        "timestamp": new Date()
      });
    }

  } catch (err) {
    logger1.errorWithLineNumber('An error occurred:', err);
    console.error('Database Error');
    console.error(err);
    res.send({
      success: false,
      code: 201,
      status: err.stack,
      Data: {},
      "timestamp": new Date()
    });
  }
});


module.exports = {
  AddBrand,
  UpdateBrand,
  DeleteBrand,
  ListBrand
}