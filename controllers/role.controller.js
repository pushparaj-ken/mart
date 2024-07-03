const catchAsync = require('../utils/catchAsync');
const logger1 = require('../config/logger');
const Role = require('../model/role')
const Services = require('../services/excel')

const AddRole = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    if (values.name != '' && values.name != null && values.name != undefined) {
      const RoleDetails = await Role.findOne({ status: 0, name: values.name })
      if (RoleDetails != null) {
        res.send({
          code: 201,
          success: false,
          status: "RoleName Already Exists!.",
          timestamp: new Date()
        });
      } else {
        let permissions = [];
        if (values.hasOwnProperty("permissions") && values.permissions.length > 0) {
          permissions = values.permissions;
        }
        const Data = {
          name: values.name,
          createdBy: req.userdetails.name,
          permissions: permissions,
        }
        Role(Data).save().then((Result) => {
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


const UpdateRole = catchAsync(async (req, res) => {
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
      Role.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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

const DeleteRole = catchAsync(async (req, res) => {
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
      Role.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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

const ListRole = catchAsync(async (req, res) => {
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
    const totalpage = await Role.countDocuments(query)
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
        $project: {
          id: 1,
          Name: "$name",
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
    const Results = await Role.aggregate(pipeline);
    if (Results.length > 0) {
      const Records = Results.map(({ id, is_verified, status, ...rest }) => rest);
      let filePath = await Services.ExportCommonExcel(Records, "Role_list");
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

const GetRoleInAdmin = catchAsync(async (req, res) => {
  let values = req.params
  if (values.id != '' && values.id != null && values.id != undefined) {
    let RolesDetails = await Role.aggregate([
      {
        $match: {
          id: values.id
        },
      },
      {
        $unwind: {
          path: "$permissions",
        },
      },
      {
        $lookup: {
          from: "menus",
          localField: "permissions.menuid",
          foreignField: "id",
          as: "Menu1",
        },
      },
      {
        $lookup: {
          from: "menus",
          localField: "permissions.menuid",
          foreignField: "subItems.id",
          as: "Menu2",
        },
      },
      {
        $lookup: {
          from: "menus",
          localField: "permissions.menuid",
          foreignField: "subItems.subItems.id",
          as: "Menu3",
        },
      },
      {
        $addFields: {
          Menu3: {
            $arrayElemAt: ["$Menu3.subItems", 0],
          },
        },
      },
      {
        $addFields: {
          MainMenu: {
            $filter: {
              input: {
                $map: {
                  input: "$Menu1",
                  as: "mainItem",
                  in: {
                    $cond: {
                      if: {
                        $eq: [
                          "$$mainItem.id",
                          "$permissions.menuid",
                        ],
                      },
                      then: "$$mainItem",
                      else: "",
                    },
                  },
                },
              },
              as: "filteredSubItems",
              cond: {
                $ne: ["$$filteredSubItems", ""],
              },
            },
          },
          SubMenu: {
            $filter: {
              input: {
                $map: {
                  input: {
                    $arrayElemAt: [
                      "$Menu2.subItems",
                      0,
                    ],
                  },
                  as: "subItem",
                  in: {
                    $cond: {
                      if: {
                        $eq: [
                          "$$subItem.id",
                          "$permissions.menuid",
                        ],
                      },
                      then: "$$subItem",
                      else: "",
                    },
                  },
                },
              },
              as: "filteredSubItems",
              cond: {
                $ne: ["$$filteredSubItems", ""],
              },
            },
          },
          ChildMenu: {
            $filter: {
              input: {
                $map: {
                  input: {
                    $arrayElemAt: [
                      "$Menu3.subItems",
                      0,
                    ],
                  },
                  as: "childItem",
                  in: {
                    $cond: {
                      if: {
                        $eq: [
                          "$$childItem.id",
                          "$permissions.menuid",
                        ],
                      },
                      then: "$$childItem",
                      else: "",
                    },
                  },
                },
              },
              as: "filteredchildItems",
              cond: {
                $ne: ["$$filteredchildItems", ""],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          status: 1,
          createdAt: 1,
          createdBy: 1,
          updatedAt: 1,
          updatedBy: 1,
          permissions: {
            id: "$permissions.id",
            menuid: "$permissions.menuid",
            menuname: {
              $switch: {
                branches: [
                  {
                    case: {
                      $eq: [
                        {
                          $arrayElemAt: [
                            "$MainMenu.id",
                            0,
                          ],
                        },
                        "$permissions.id",
                      ],
                    },
                    then: {
                      $arrayElemAt: [
                        "$MainMenu.label",
                        0,
                      ],
                    },
                  },
                  {
                    case: {
                      $eq: [
                        {
                          $arrayElemAt: [
                            "$SubMenu.id",
                            0,
                          ],
                        },
                        "$permissions.id",
                      ],
                    },
                    then: {
                      $arrayElemAt: [
                        "$SubMenu.label",
                        0,
                      ],
                    },
                  },
                  {
                    case: {
                      $eq: [
                        {
                          $arrayElemAt: [
                            "$ChildMenu.id",
                            0,
                          ],
                        },
                        "$permissions.id",
                      ],
                    },
                    then: {
                      $arrayElemAt: [
                        "$ChildMenu.label",
                        0,
                      ],
                    },
                  },
                ],
                default: "",
              },
            },
            read: "$permissions.read",
            write: "$permissions.write",
            edit: "$permissions.edit",
            delete: "$permissions.delete",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          id: {
            $first: "$id",
          },
          name: {
            $first: "$name",
          },
          status: {
            $first: "$status",
          },
          createdAt: {
            $first: "$createdAt",
          },
          createdBy: {
            $first: "$createdBy",
          },
          updatedAt: {
            $first: "$updatedAt",
          },
          updatedBy: {
            $first: "$updatedBy",
          },
          permissions: {
            $push: {
              id: "$permissions.id",
              menuid: "$permissions.menuid",
              menuname: "$permissions.menuname",
              read: "$permissions.read",
              write: "$permissions.write",
              edit: "$permissions.edit",
              delete: "$permissions.delete",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          status: 1,
          createdAt: 1,
          createdBy: 1,
          updatedAt: 1,
          updatedBy: 1,
          permissions: 1,
        },
      },
    ]);

    if (RolesDetails && RolesDetails.length > 0) {
      res.send({
        code: 200,
        success: true,
        message: "Role's Retrieved Success.",
        data: RolesDetails,
        timestamp: new Date()
      })
    } else {
      let RoleDetailsParticular = await Role.find(values, { _id: 0, __v: 0 }).lean().exec();
      if (RoleDetailsParticular.length > 0) {
        res.send({
          code: 200,
          success: true,
          message: "Role's Retrieved Success.",
          data: RoleDetailsParticular,
          timestamp: new Date()
        })
      } else {
        res.send({
          code: 201,
          success: false,
          message: "No Role's found.",
          timestamp: new Date()
        });
      }
    }
  } else {
    res.send({
      code: 201,
      success: false,
      status: "Id required to Update Role.",
      timestamp: new Date()
    });
  }
});

module.exports = {
  AddRole,
  UpdateRole,
  DeleteRole,
  ListRole,
  GetRoleInAdmin
}