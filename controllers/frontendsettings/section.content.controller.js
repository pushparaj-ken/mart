const catchAsync = require('../../utils/catchAsync');
const logger1 = require('../../config/logger');
const Sectioncontent = require('../../model/sectioncontent')
const Services = require('../../services/excel')
const imageUpload = require('../../services/image_upload.service');
const foldername = "Sectioncontent";

const Addsectioncontent = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    let image_new = "";
    const files = req.files;
    if (files.sectioncontent_icon) {
      let { buffer, originalname } = files.sectioncontent_icon[0];
      let image = await imageUpload.upload(buffer, originalname, foldername);
      console.log(image.Location);
      image_new = image.Location;
    } else {
      image_new = image_new;
    }
    const Data = {
      store_id: values.store_id,
      content_heading: values.content_heading,
      content_name: values.content_name,
      sectioncontent_icon: image_new,
      enable_status: values.enable_status,
      orderBy: values.orderBy,
      createdBy: req.userdetails.name,
    }
    Sectioncontent(Data).save().then((Result) => {
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

const Updatesectioncontent = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const files = req.files;
    const params = req.params;
    if (params.id != '' && params.id != null && params.id != undefined) {
      let image_new = values.sectioncontent_icon;
      if (files.sectioncontent_icon) {
        let { buffer, originalname } = files.sectioncontent_icon[0];
        let image = await imageUpload.upload(buffer, originalname, foldername);
        console.log(image.Location);
        values.sectioncontent_icon = image.Location;
      } else {
        values.sectioncontent_icon = image_new;
      }
      values.updatedBy = req.userdetails.name
      const query = {
        id: params.id
      }
      const changes = {
        $set: values
      }
      Sectioncontent.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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

const Deletesectioncontent = catchAsync(async (req, res) => {
  try {
    const params = req.params;
    const values = req.body
    if (params.id != '' && params.id != null && params.id != undefined) {
      const query = params.id
      const changes = {
        $set: values
      }
      Sectioncontent.findByIdAndUpdate(query, changes, { upsert: true }).lean().exec().then((UpdateStatus) => {
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
          status: "DATABASE_ERROR.",
          timestamp: new Date()
        });
      })
    } else {
      res.send({
        code: 201,
        success: false,
        status: "Id required to Update Blogcategory.",
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

const Listsectioncontent = catchAsync(async (req, res) => {
  try {
    let values = req.query
    let query = {}
    if (values.id != '' && values.id != null && values.id != undefined) {
      query.id = values.id
    }
    if (values.status != '' && values.status != null && values.status != undefined) {
      query.status = values.status
    }
    const totalpage = await Sectioncontent.countDocuments(query)
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
        $sort:
        {
          orderBy: 1 // 1 for ascending order and -1 for descending order
        }
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
          store_id: 1,
          storeName: {
            $arrayElemAt: ["$StoresDetails.name", 0],
          },
          content_heading: 1,
          content_name: 1,
          icon: "$sectioncontent_icon",
          enable_status: 1,
          orderBy: 1,
          status: 1,
          Status: {
            $cond: {
              if: { $eq: ["$status", 0] },
              then: "Active",
              else: "In Active"
            }
          },
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
      },
    );
    const Results = await Sectioncontent.aggregate(pipeline);
    if (Results.length > 0) {
      const Records = Results.map(({ id, is_verified, status, ...rest }) => rest);
      let filePath = await Services.ExportCommonExcel(Records, "Sectioncontent_list");
      var fullPublicUrl = process.env.fullPublicUrl;
      let downloadurl = `${fullPublicUrl}${filePath}`
      res.send({
        success: true,
        code: 200,
        status: "Sectioncontent Lists retrieved successfully",
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
  Addsectioncontent,
  Updatesectioncontent,
  Deletesectioncontent,
  Listsectioncontent
}