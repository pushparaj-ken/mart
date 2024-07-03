const catchAsync = require('../utils/catchAsync');
const logger1 = require('../config/logger');
const product = require('../model/product')
//const Category = require('../model/category')
const Services = require('../services/excel')
const imageUpload = require('../services/image_upload.service');
const foldername = "Products";



const AddProduct = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const files = req.files;
    if (values.productname != '' && values.productname != null && values.productname != undefined) {
      const ProductDetails = await product.findOne({ status: 0, productname: values.productname })
      if (ProductDetails != null) {
        res.send({
          code: 201,
          success: false,
          status: "Product Already Exists!.",
          timestamp: new Date()
        });
      } else {
        let productfeaturedimage = "";
        let producthoverfeaturedimage = "";
        if (files.productfeaturedimage) {
          let { buffer, originalname } = files.productfeaturedimage[0];
          let productfeatured = await imageUpload.upload(buffer, originalname, foldername);
          console.log(productfeatured.Location);
          productfeaturedimage = productfeatured.Location;
        } else {
          productfeaturedimage = productfeaturedimage;
        }

        if (files.producthoverfeaturedimage) {
          let { buffer, originalname } = files.producthoverfeaturedimage[0];
          let producthoverfeatured = await imageUpload.upload(buffer, originalname, foldername);
          console.log(producthoverfeatured.Location);
          producthoverfeaturedimage = producthoverfeatured.Location;
        } else {
          producthoverfeaturedimage = producthoverfeaturedimage;
        }
        const Data = {
          store_id: values.store_id,
          productfeaturedimage: productfeaturedimage,
          producthoverfeaturedimage: producthoverfeaturedimage,
          productname: values.productname,
          brand: values.brand,
          category: values.category,
          subcategory: values.subcategory,
          childcategory: values.childcategory,
          mrpprice: values.mrpprice,
          sellingprice: values.sellingprice,
          resellerprice: values.resellerprice,
          productgst: values.productgst,
          shortdescription: values.shortdescription,
          description: values.description,
          orderBy: values.orderBy,
          createdBy: req.userdetails.name,
        }
        product(Data).save().then((Result) => {
          res.send({
            success: true,
            code: 200,
            status: "Data Saved Success",
            productid: Result.id,
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

const UpdateProduct = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const files = req.files;
    const params = req.params;
    if (params.id != '' && params.id != null && params.id != undefined) {
      let productfeaturedimage = values.productfeaturedimage;
      let producthoverfeaturedimage = values.producthoverfeaturedimage;

      if (files.productfeaturedimage) {
        let { buffer, originalname } = files.productfeaturedimage[0];
        let image = await imageUpload.upload(buffer, originalname, foldername);
        console.log(image.Location);
        values.productfeaturedimage = image.Location;
      } else {
        values.productfeaturedimage = productfeaturedimage;
      }

      if (files.producthoverfeaturedimage) {
        let { buffer, originalname } = files.producthoverfeaturedimage[0];
        let image = await imageUpload.upload(buffer, originalname, foldername);
        console.log(image.Location);
        values.producthoverfeaturedimage = image.Location;
      } else {
        values.producthoverfeaturedimage = producthoverfeaturedimage;
      }

      // let productimage = [];
      // if (files.productimage) {
      //   let file = files.productimage;
      //   for (each in file) {
      //     const { buffer, originalname } = file[each];
      //     await imageUpload.upload(buffer, originalname, foldername).then((filePATH) => {
      //       productimage.push(filePATH.Location);
      //     }).catch(err => res.send(err));
      //   }
      //   productimage = productimage;
      // }

      // if (productimage) {
      //   values.productimage = productimage
      // }

      const query = {
        id: params.id
      }
      const changes = {
        $set: values
      }
      product.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
        res.send({
          success: true,
          code: 200,
          status: "Data Saved Success",
          timestamp: new Date()
        });
      }).catch((err) => {
        // emailError.sendErrorEmail(err.stack, req.body, req.originalUrl);
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
        status: "Id required to Update product.",
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

const UpdateProductDeatils = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const params = req.params;
    if (params.id != '' && params.id != null && params.id != undefined) {
      const query = {
        id: params.id
      }
      const changes = {
        $set: values
      }
      product.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
        res.send({
          success: true,
          code: 200,
          status: "Data Saved Success",
          timestamp: new Date()
        });
      }).catch((err) => {
        // emailError.sendErrorEmail(err.stack, req.body, req.originalUrl);
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
        status: "Id required to Update product.",
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

const DeleteProduct = catchAsync(async (req, res) => {
  try {
    const params = req.params;
    const values = req.body
    if (params.id != '' && params.id != null && params.id != undefined) {
      const query = {
        id: params.id
      }
      const changes = {
        $set: values
      }
      product.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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
        status: "Id required to Update product.",
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

const ListProduct = catchAsync(async (req, res) => {
  try {
    let values = req.query
    let query = {}
    if (values.id != '' && values.id != null && values.id != undefined) {
      query.id = values.id
    }
    if (values.status != '' && values.status != null && values.status != undefined) {
      query.status = parseInt(values.status)

    }
    const totalpage = await product.countDocuments(query)
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
          orderBy: 1
        }
      },
      {
        $lookup: {
          from: "categories",
          let: {
            category: "$category",
            subcategory: "$subcategory",
            childcategory: "$childcategory",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$id", "$$category"],
                    },
                  ],
                },
              },
            },
            {
              $unwind: "$subcategory",
            },
            {
              $unwind: "$subcategory.childcategory",
            },
            {
              $project: {
                _id: 0,
                catdetails: {
                  id: "$id",
                  name: "$name",
                },
                subdetails: {
                  id: "$subcategory.id",
                  name: "$subcategory.name",
                },
                childdetails: {
                  id: "$subcategory.childcategory.id",
                  name: "$subcategory.childcategory.name",
                },
              },
            },
          ],
          as: "CategorysDetails",
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
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "id",
          as: "Brand",
        },
      },
      {
        $lookup: {
          from: "variants",
          let: {
            variant: "$variant",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ["$id", "$$variant.variantid"],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                variants: {
                  $push: {
                    id: "$id",
                    name: "$name",
                  },
                },
                units: {
                  $push: "$units",
                },
              },
            },
            {
              $project: {
                variants: 1,
                units: {
                  $reduce: {
                    input: "$units",
                    initialValue: [],
                    in: {
                      $concatArrays: [
                        "$$value",
                        "$$this",
                      ],
                    },
                  },
                },
              },
            },
          ],
          as: "variantDetails",
        }
      },
      {
        $addFields: {
          categoryName: {
            $filter: {
              input: {
                $map: {
                  input: "$CategorysDetails",
                  as: "cat",
                  in: {
                    $cond: {
                      if: {
                        $eq: ["$$cat.catdetails.id", "$category"],
                      },
                      then: "$$cat.catdetails.name",
                      else: "",
                    },
                  },
                },
              },
              as: "details",
              cond: {
                $ne: ["$$details", ""],
              },
            },
          },
          subcategoryName: {
            $filter: {
              input: {
                $map: {
                  input: "$CategorysDetails",
                  as: "cat",
                  in: {
                    $cond: {
                      if: {
                        $eq: ["$$cat.subdetails.id", "$subcategory"],
                      },
                      then: "$$cat.subdetails.name",
                      else: "",
                    },
                  },
                },
              },
              as: "details",
              cond: {
                $ne: ["$$details", ""],
              },
            },
          },
          childcategoryName: {
            $filter: {
              input: {
                $map: {
                  input: "$CategorysDetails",
                  as: "cat",
                  in: {
                    $cond: {
                      if: {
                        $eq: ["$$cat.childdetails.id", "$childcategory"],
                      },
                      then: "$$cat.childdetails.name",
                      else: "",
                    },
                  },
                },
              },
              as: "details",
              cond: {
                $ne: ["$$details", ""],
              },
            },
          },
        }
      },
      {
        $addFields: {
          variants: {
            $arrayElemAt: ["$variantDetails.variants", 0]
          },
          units: {
            $arrayElemAt: ["$variantDetails.units", 0]
          }
        }
      },
      {
        $project: {
          id: 1,
          productname: 1,
          brand: 1,
          store_id: 1,
          StoreName: {
            $arrayElemAt: ["$StoresDetails.name", 0],
          },
          brandName: {
            $arrayElemAt: ["$Brand.name", 0],
          },
          category: 1,
          subcategory: 1,
          childcategory: 1,
          categoryName: {
            $cond: {
              if: {
                $gt: [{ $size: "$categoryName" }, 0],
              },
              then: {
                $arrayElemAt: ["$categoryName", 0],
              },
              else: "",
            },
          },
          subcategoryName: {
            $cond: {
              if: {
                $gt: [{ $size: "$subcategoryName" }, 0],
              },
              then: {
                $arrayElemAt: ["$subcategoryName", 0],
              },
              else: "",
            },
          },
          childcategoryName: {
            $cond: {
              if: {
                $gt: [{ $size: "$childcategoryName" }, 0],
              },
              then: {
                $arrayElemAt: ["$childcategoryName", 0],
              },
              else: "",
            },
          },
          mrpprice: 1,
          sellingprice: 1,
          resellerprice: 1,
          productgst: 1,
          productfeaturedimage: 1,
          producthoverfeaturedimage: 1,
          productimage: 1,
          shortdescription: 1,
          description: 1,
          orderBy: 1,
          status: 1,
          variant: {
            $map: {
              input: "$variant",
              as: "var",
              in: {
                id: "$$var.id",
                variantid: "$$var.variantid",
                variantname: {
                  $let: {
                    vars: { var: "$$var.variantid" },
                    in: {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input: "$variants",
                                as: "v",
                                cond: {
                                  $eq: [
                                    "$$v.id",
                                    "$$var",
                                  ],
                                },
                              },
                            },
                            as: "filtered",
                            in: "$$filtered.name",
                          },
                        },
                        0,
                      ],
                    },
                  },
                },
                unitid: "$$var.unitid",
                unittname: {
                  $let: {
                    vars: { var: "$$var.unitid" },
                    in: {
                      $arrayElemAt: [
                        {
                          $map: {
                            input: {
                              $filter: {
                                input: "$units",
                                as: "u",
                                cond: {
                                  $eq: [
                                    "$$u.id",
                                    "$$var",
                                  ],
                                },
                              },
                            },
                            as: "filtered",
                            in: "$$filtered.name",
                          },
                        },
                        0,
                      ],
                    },
                  },
                },
                variantmrp: "$$var.variantmrp",
                variantsellingprice: "$$var.variantsellingprice",
                variantresellerprice: "$$var.variantresellerprice",
                variantproductgst: "$$var.variantproductgst",
              },
            },
          },
          Status: {
            $cond: {
              if: { $eq: ["$status", 0] },
              then: "Active",
              else: "In Active",
            },
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
    const Results = await product.aggregate(pipeline);
    if (Results.length > 0) {
      const Records = Results.map(({ id, is_verified, status, ...rest }) => rest);
      let filePath = await Services.ExportCommonExcel(Records, "product_list");
      var fullPublicUrl = process.env.fullPublicUrl;
      let downloadurl = `${fullPublicUrl}${filePath}`
      res.send({
        success: true,
        code: 200,
        status: "Product Lists retrieved successfully",
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

const AddVariant = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    if (values.productid != '' && values.productid != null && values.productid != undefined) {
      values.updatedBy = req.userdetails.name
      const query = {
        id: values.productid
      }
      const changes = {
        $push: {
          variant: [values]
        }
      }
      product.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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
        status: "Productid required to Update Blogcategory.",
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

const UpdateVariant = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const params = req.params;
    if (params.id != '' && params.id != null && params.id != undefined) {
      values.updatedBy = req.userdetails.name
      const query = {
        'variant.id': params.id
      };
      let responsejson = {}
      for (const key in values) {
        responsejson['variant.$.' + key] = values[key]
      }
      const changes = {
        $set: responsejson
      };
      product.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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

const DeleteVariant = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const params = req.params;
    if (params.id != '' && params.id != null && params.id != undefined) {
      values.updatedBy = req.userdetails.name
      const query = {
        'variant.id': params.id
      };

      product.deleteOne(query).lean().exec().then((UpdateStatus) => {
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

module.exports = {
  AddProduct,
  DeleteProduct,
  UpdateProduct,
  UpdateProductDeatils,
  ListProduct,
  AddVariant,
  UpdateVariant,
  DeleteVariant,
}