
const catchAsync = require('../utils/catchAsync');
const logger1 = require('../config/logger');
const AdminUsers = require('../model/adminusers')
const Store = require('../model/store')
const Role = require('../model/role')
const Services = require('../services/excel')
const imageUpload = require('../services/image_upload.service');
const Category = require('../model/category')

const Register = catchAsync(async (req, res) => {
  try {
    let values = req.body;
    if (values.email != '' && values.email != null && values.email != undefined) {
      let AdminDetails = await AdminUsers.findOne({ status: 0, $or: [{ email: values.email }, { mobile: values.mobile }] })
      if (AdminDetails != null) {
        res.send({
          code: 201,
          success: false,
          status: "Email Or Mobile are Already Exists!.",
          timestamp: new Date()
        });
      } else {
        let Data = {
          email: values.email,
          password: values.password,
          name: values.name,
          mobile: values.mobile,
          roleId: values.roleId,
          store_id: values.store_id,
          createdBy: req.userdetails.name,
        }
        AdminUsers(Data).save().then((Result) => {
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

const Login = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    if (values.email != '' && values.email != null && values.email != undefined && values.password != '' && values.password != null && values.password != undefined) {
      const query = {};
      query.email = values.email;
      query.status = 0;
      const AdminDetails = await AdminUsers.findOne(query)
      if (AdminDetails != null) {
        const StoreDetails = await Store.findOne({ id: AdminDetails.store_id }, { name: 1, _id: 0 })
        const RoleDetails = await Role.findOne({ id: AdminDetails.roleId }, { name: 1, _id: 0 })
        let Response = {
          id: AdminDetails.id,
          email: AdminDetails.email,
          name: AdminDetails.name,
          mobile: AdminDetails.mobile,
          roleId: AdminDetails.roleId,
          roleName: RoleDetails.name,
          store_id: AdminDetails.store_id,
          StoreName: StoreDetails.name,
          status: AdminDetails.status,
        }
        const isPasswordMatched = await AdminDetails.comparePassword(values.password);
        if (!isPasswordMatched) {
          res.send({
            code: 201,
            success: false,
            status: "Password mismatch",
            timestamp: new Date()
          });
        } else {
          const token = await AdminDetails.getJWTToken();
          res.send({
            success: true,
            code: 200,
            Data: Response,
            Token: token,
            status: "Data Saved Success",
          });
        }
      } else {
        res.send({
          code: 201,
          success: false,
          status: "Email or Password mismatch",
          timestamp: new Date()
        });
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

const UpdateUsers = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const params = req.params;
    if (params.id != '' && params.id != null && params.id != undefined) {
      values.updatedBy = req.userdetails.name
      const query = {
        id: params.id
      }
      const changes = {
        $set: values
      }
      AdminUsers.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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

const DeleteUsers = catchAsync(async (req, res) => {
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
      AdminUsers.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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
        status: "Id required to Update Role.",
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

const ListAllUsers = catchAsync(async (req, res) => {
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
    if (values.mobile != '' && values.mobile != null && values.mobile != undefined) {
      query.mobile = parseInt(values.mobile)
    }
    const totalpage = await AdminUsers.countDocuments(query)
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
          from: "roles",
          localField: "roleId",
          foreignField: "id",
          as: "RolesDetails"
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
          _id: 0,
          id: 1,
          Email: "$email",
          Name: "$name",
          Mobile: "$mobile",
          roleId: 1,
          store_id: 1,
          RoleName: {
            $arrayElemAt: ["$RolesDetails.name", 0],
          },
          StoreName: {
            $arrayElemAt: ["$StoresDetails.name", 0],
          },
          status: 1,
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
        }
      },
    );
    const Results = await AdminUsers.aggregate(pipeline);
    if (Results.length > 0) {
      const Records = Results.map(({ id, roleId, store_id, status, ...rest }) => rest);
      let filePath = await Services.ExportCommonExcel(Records, "AdminUsers_list");
      var fullPublicUrl = process.env.fullPublicUrl;
      let downloadurl = `${fullPublicUrl}${filePath}`
      res.send({
        success: true,
        code: 200,
        status: "Role Lists retrieved successfully",
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

const UploadCommonImage = catchAsync(async (req, res) => {
  let values = req.body;
  let files = req.files;

  if (files.image != '' && files.image != null && files.image != undefined

  ) {

    let image_new = "";
    let foldername = "common"
    if (values.foldername != '' && values.foldername != null && values.foldername != undefined) {
      foldername = values.foldername
    }
    if (files.image) {
      const { buffer, originalname } = files.image[0];
      let image = await imageUpload.upload(buffer, originalname, foldername);
      image_new = image.Location;
    } else {
      image_new = image_new;
    }
    res.send({
      success: true,
      code: 200,
      Image_url: image_new,
      Status: "Images Saved Success",
    });

  } else {
    res.send({
      code: 201,
      success: false,
      status: "All Fields are Mandatory",
      timestamp: new Date()
    });
  }
});

const UploadMultipleImage = catchAsync(async (req, res) => {
  let values = req.body;
  let files = req.files;

  if (files.image != '' && files.image != null && files.image != undefined

  ) {

    let image_new = "";
    let foldername = "common"
    if (values.foldername != '' && values.foldername != null && values.foldername != undefined) {
      foldername = values.foldername
    }
    let productimage = [];
    if (files.image) {
      let file = files.image;
      for (each in file) {
        const { buffer, originalname } = file[each];
        await imageUpload.upload(buffer, originalname, foldername).then((filePATH) => {
          productimage.push(filePATH.Location);
        }).catch(err => res.send(err));
      }
    }
    res.send({
      success: true,
      code: 200,
      Image_url: productimage,
      Status: "Images Saved Success",
    });

  } else {
    res.send({
      code: 201,
      success: false,
      status: "All Fields are Mandatory",
      timestamp: new Date()
    });
  }
});

const CategoryList = catchAsync(async (req, res) => {
  try {
    let values = req.query
    let query = {}
    if (values.category != '' && values.category != null && values.category != undefined) {
      query.id = values.category
    }
    if (values.highlight != '' && values.highlight != null && values.highlight != undefined) {
      query.highlight = values.highlight
    }
    if (values.store_id != '' && values.store_id != null && values.store_id != undefined) {
      query.store_id = values.store_id
    }
    let subcategory = ''
    if (values.subcategory != '' && values.subcategory != null && values.subcategory != undefined) {
      subcategory = values.subcategory
    }
    let childcategory = ''
    if (values.childcategory != '' && values.childcategory != null && values.childcategory != undefined) {
      childcategory = values.childcategory
    }
    let productid = ''
    if (values.productid != '' && values.productid != null && values.productid != undefined) {
      productid = values.productid
    }

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
          _id: 0,
          id: 1,
          name: 1,
          image: 1,
          store_id: 1,
          StoreName: {
            $arrayElemAt: ["$StoresDetails.name", 0],
          },
          subcategory: {
            $filter: {
              input: {
                $map: {
                  input: "$subcategory",
                  as: "sub",
                  in: {
                    $switch: {
                      branches: [
                        {
                          case: {
                            $and: [
                              {
                                $eq: [
                                  "$$sub.id",
                                  subcategory,
                                ],
                              },
                            ],
                          },
                          then: {
                            id: "$$sub.id",
                            name: "$$sub.name",
                            image: "$$sub.image",
                            childcategory: {
                              $filter: {
                                input: {
                                  $map: {
                                    input: "$$sub.childcategory",
                                    as: "child",
                                    in: {
                                      $switch: {
                                        branches: [
                                          {
                                            case: {
                                              $and: [
                                                {
                                                  $eq: [
                                                    "$$child.id",
                                                    childcategory,
                                                  ],
                                                },
                                              ],
                                            },
                                            then: {
                                              id: "$$child.id",
                                              name: "$$child.name",
                                              image: "$$child.image",

                                            },
                                          },
                                          {
                                            case: {
                                              $or: [
                                                {
                                                  $eq: [
                                                    childcategory,
                                                    "",
                                                  ],
                                                },
                                              ],
                                            },
                                            then: {
                                              id: "$$child.id",
                                              name: "$$child.name",
                                              image: "$$child.image",

                                            },
                                          },
                                        ],
                                        default: "",
                                      }
                                    },
                                  },
                                },
                                as: "filteredchildcategory",
                                cond: {
                                  $ne: ["$$filteredchildcategory", ""],
                                },
                              },
                            },
                          },
                        },
                        {
                          case: {
                            $or: [
                              {
                                $eq: [
                                  subcategory,
                                  "",
                                ],
                              },
                            ],
                          },
                          then: {
                            id: "$$sub.id",
                            name: "$$sub.name",
                            image: "$$sub.image",
                            childcategory: {
                              $filter: {
                                input: {
                                  $map: {
                                    input: "$$sub.childcategory",
                                    as: "child",
                                    in: {
                                      $switch: {
                                        branches: [
                                          {
                                            case: {
                                              $and: [
                                                {
                                                  $eq: [
                                                    "$$child.id",
                                                    childcategory,
                                                  ],
                                                },
                                              ],
                                            },
                                            then: {
                                              id: "$$child.id",
                                              name: "$$child.name",
                                              image: "$$child.image",
                                            },
                                          },
                                          {
                                            case: {
                                              $or: [
                                                {
                                                  $eq: [
                                                    childcategory,
                                                    "",
                                                  ],
                                                },
                                              ],
                                            },
                                            then: {
                                              id: "$$child.id",
                                              name: "$$child.name",
                                              image: "$$child.image",
                                            },
                                          },
                                        ],
                                        default: "",
                                      }
                                    },
                                  },
                                },
                                as: "filteredchildcategory",
                                cond: {
                                  $ne: ["$$filteredchildcategory", ""],
                                },
                              },
                            },
                          },
                        },
                      ],
                      default: "", // Exclude subcategories when ids are not equal and values.subid is empty
                    },
                  },
                },
              },
              as: "filteredSubcategory",
              cond: {
                $ne: ["$$filteredSubcategory", ""],
              },
            },
          },
        }
      }
    );
    const Results = await Category.aggregate(pipeline);
    if (Results.length > 0) {

      res.send({
        success: true,
        code: 200,
        Data: Results,
        "timestamp": new Date()
      });
    } else {
      res.send({
        success: false,
        code: 201,
        status: "No Records Found!",
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
  Register,
  Login,
  UpdateUsers,
  DeleteUsers,
  ListAllUsers,
  UploadCommonImage,
  UploadMultipleImage,
  CategoryList,
}