const catchAsync = require('../../utils/catchAsync');
const logger1 = require('../../config/logger');
const Menu = require('../../model/menu')
const Services = require('../../services/excel')
const imageUpload = require('../../services/image_upload.service');
const foldername = "Menu";

const AddMenu = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const files = req.files;
    console.log(values, "Values Data")
    if (values.label != '' && values.label != null && values.label != undefined) {
      const MenuDetails = await Menu.findOne({ status: 0, name: values.label })
      if (MenuDetails != null) {
        res.send({
          code: 201,
          success: false,
          status: "Menu Already Exists!.",
          timestamp: new Date()
        });
      } else {

        const Data = {
          label: values.label,
          link: values.link,
          icon: values.icon,
          isCollapsed: values.isCollapsed,
          isTitle: values.isTitle,
          badge: values.badge,
          isLayout: values.isLayout,
          orderBy: values.orderBy,
          createdBy: req.userdetails.name,
        }
        Menu(Data).save().then((Result) => {
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


const UpdateMenu = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const params = req.params;
    if (params.id != '' && params.id != null && params.id != undefined) {
      values.updatedBy = req.userdetails.name

      // console.log(ObjectId("65ba1dadf3904ece63c1647f"), "stating");
      const query = {
        id: params.id
      }
      const changes = {
        $set: values
      }
      Menu.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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

const DeleteMenu = catchAsync(async (req, res) => {
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
      Menu.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
        res.send({
          success: true,
          code: 200,
          status: "Record deleted successfully!",
          timestamp: new Date()
        });
      }).catch((err) => {
        // emailError.sendErrorEmail(err.stack, req.body, req.originalUrl);
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
        status: "Id required to Update Category.",
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

const ListMenu = catchAsync(async (req, res) => {
  try {
    let values = req.query
    let query = {}
    if (values.id != '' && values.id != null && values.id != undefined) {
      query.id = values.id;
    }
    if (values.name != '' && values.name != null && values.name != undefined) {
      query.name = { $regex: values.name, $options: "i" }
    }
    if (values.status != '' && values.status != null && values.status != undefined) {
      query.status = parseInt(values.status)
    }
    if (values.store_id != '' && values.store_id != null && values.store_id != undefined) {
      query.store_id = values.store_id
    }
    const totalpage = await Menu.countDocuments(query)
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

    pipeline.unshift({
      $match: query
    }, {
      $sort: {
        orderBy: -1
      }
    }, {
      $project: {
        id: 1,
        Label: "$label",
        Link: "$link",
        Icon: "$icon",
        IsCollapsed: "$isCollapsed",
        IsTitle: "$isTitle",
        Badge: "$badge",
        IsLayout: "$isLayout",
        OrderBy: "$orderBy",
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
    },);
    const Results = await Menu.aggregate(pipeline);
    if (Results.length > 0) {
      const Records = Results.map(({ id, status, ...rest }) => rest);
      let filePath = await Services.ExportCommonExcel(Records, "Menu_list");
      var fullPublicUrl = process.env.fullPublicUrl;
      let downloadurl = `${fullPublicUrl}${filePath}`
      res.send({
        success: true,
        code: 200,
        status: "Menu Lists retrieved successfully",
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
})

const AddSubMenu = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    console.log(values, "Values Data")
    if (values.label != '' && values.label != null && values.label != undefined) {
      const SubMenuDetails = await Menu.findOne({ status: 0, "subItems.label": values.label })
      if (SubMenuDetails != null) {
        res.send({
          code: 201,
          success: false,
          status: "SubMenu Already Exists!.",
          timestamp: new Date()
        });
      } else {
        values.createdBy = req.userdetails.name;
        const query = {
          id: values.menuid
        }
        const changes = {
          $push: {
            submenu: [values]
          }
        }
        Menu.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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

const UpdateSubMenu = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const files = req.files;
    const params = req.params;
    if (params.id != '' && params.id != null && params.id != undefined) {
      values.updatedBy = req.userdetails.name
      const query = {
        'subItems.id': params.id
      };
      let responsejson = {}
      for (const key in values) {
        responsejson['subItems.$.' + key] = values[key]
      }
      const changes = {
        $set: responsejson
      };
      Menu.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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

const DeleteSubMenu = catchAsync(async (req, res) => {
  try {
    const params = req.params;
    const values = req.body;
    if (params.id != '' && params.id != null && params.id != undefined) {
      const query = {
        'subItems.id': params.id
      };
      let responsejson = {}
      for (const key in values) {
        responsejson['subItems.$.' + key] = values[key]
      }
      const changes = {
        $set: {
          'subItems.$.status': values.status,
          'subItems.$.updatedBy': values.updatedBy,
        }
      };
      console.log(changes, "Testing");
      Menu.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
        res.send({
          success: true,
          code: 200,
          status: "Record deleted successfully!",
          timestamp: new Date()
        });
      }).catch((err) => {
        // emailError.sendErrorEmail(err.stack, req.body, req.originalUrl);
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
        status: "Id required to Update Category.",
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

const ListSubMenu = catchAsync(async (req, res) => {
  try {
    let values = req.query
    let query = {}
    if (values.id != '' && values.id != null && values.id != undefined) {
      query.id = values.id;
    }
    if (values.name != '' && values.name != null && values.name != undefined) {
      query.name = { $regex: values.name, $options: "i" }
    }
    if (values.status != '' && values.status != null && values.status != undefined) {
      query.status = parseInt(values.status)
    }
    if (values.MenuName != '' && values.MenuName != null && values.MenuName != undefined) {
      query.MenuName = values.MenuName
    }
    query.subcategory = { $ne: [] };
    const totalpage = await Menu.countDocuments(query)
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

    pipeline.unshift({
      $unwind: {
        path: "$subItems",
      },
    }, {
      $sort: {
        "subItems.orderBy": -1
      }
    }, {
      $project: {
        _id: 0,
        id: "$subItems.id",
        parentId: "$subItems.parentId",
        MenuName: "$label",
        Menuid: "$id",
        label: "$subItems.label",
        link: "$subItems.link",
        icon: "$subItems.icon",
        isCollapsed: "$subItems.isCollapsed",
        isTitle: "$subItems.isTitle",
        badge: "$subItems.badge",
        orderBy: "$subItems.orderBy",
        status: '$subItems.status',
        Status: {
          $switch: {
            branches: [{
              case: {
                $eq: ["$subItems.status", 0],
              },
              then: "Active",
            },
            {
              case: {
                $eq: ["$subItems.status", 1],
              },
              then: "In Active",
            },
            ],
            default: "",
          },
        },
      },
    }, {
      $match: query,
    });
    const Results = await Menu.aggregate(pipeline);
    if (Results.length > 0) {
      const Records = Results.map(({ id, status, ...rest }) => rest);
      let filePath = await Services.ExportCommonExcel(Records, "SubMenu_list");
      var fullPublicUrl = process.env.fullPublicUrl;
      let downloadurl = `${fullPublicUrl}${filePath}`
      res.send({
        success: true,
        code: 200,
        status: "Category Lists retrieved successfully",
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
})


const AddChildMenu = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const files = req.files;
    if (values.label != '' && values.label != null && values.label != undefined) {
      const ChildDetails = await Menu.findOne({ id: values.menuid, 'subItems.id': values.submenuid, status: 0, "subItems.subItems.label": values.label })
      if (ChildDetails != null) {
        res.send({
          code: 201,
          success: false,
          status: "ChildMenu Already Exists!.",
          timestamp: new Date()
        });
      } else {
        values.createdBy = req.userdetails.name;
        submenuid = { id: values.menuid, 'subItems.id': values.submenuid };
        delete values.menuid
        delete values.submenuid
        const changes = {
          $push: {
            'submenu.$.childmenu': [values],
          },
        }
        Menu.findOneAndUpdate(submenuid, changes).lean().exec().then((UpdateStatus) => {
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

const UpdateChildMenu = catchAsync(async (req, res) => {
  try {
    const values = req.body;
    const params = req.params;
    if (params.id != '' && params.id != null && params.id != undefined) {
      values.updatedBy = req.userdetails.name
      const query = {
        id: values.menuid,
        'subItems.id': values.submenuid,
        'subItems.subItems.id': params.id
      };
      // Add other fields to update as needed
      let responsejson = {}
      for (const key in values) {
        responsejson['subItems.$[sub].subItems.$[child].' + key] = values[key]
      }
      console.log(responsejson)
      const changes = {
        $set: responsejson
      };
      const options = {
        arrayFilters: [
          { 'sub.id': values.submenuid },
          { 'child.id': params.id }
        ]
      };
      Menu.findOneAndUpdate(query, changes, options).lean().exec().then((UpdateStatus) => {
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

const DeleteChildMenu = catchAsync(async (req, res) => {
  try {
    const params = req.params;
    const values = req.body;
    if (params.id != '' && params.id != null && params.id != undefined) {
      values.updatedBy = req.userdetails.name
      const query = {
        id: values.menuid,
        'subItems.id': values.submenuid,
        'subItems.subItems.id': params.id
      };
      // Add other fields to update as needed
      let responsejson = {}
      for (const key in values) {
        responsejson['subItems.$[sub].subItems.$[child].' + key] = values[key]
      }
      console.log(responsejson)
      const changes = {
        $set: {
          'subItems.$[sub].subItems.$[child].status': values.status,
          'subItems.$[sub].subItems.$[child].updatedBy': values.updatedBy,
        }
      };
      const options = {
        arrayFilters: [
          { 'sub.id': values.submenuid },
          { 'child.id': params.id }
        ]
      };
      Menu.findOneAndUpdate(query, changes, options).lean().exec().then((UpdateStatus) => {
        res.send({
          success: true,
          code: 200,
          status: "Record deleted successfully!",
          timestamp: new Date()
        });
      }).catch((err) => {
        // emailError.sendErrorEmail(err.stack, req.body, req.originalUrl);
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
        status: "Id required to Update Category.",
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

const ListChildMenu = catchAsync(async (req, res) => {
  try {
    let values = req.query
    let query = {}
    if (values.id != '' && values.id != null && values.id != undefined) {
      query.id = values.id;
    }
    if (values.name != '' && values.name != null && values.name != undefined) {
      query.name = { $regex: values.name, $options: "i" }
    }
    if (values.status != '' && values.status != null && values.status != undefined) {
      query.status = parseInt(values.status)
    }
    if (values.SubMenuName != '' && values.SubMenuName != null && values.SubMenuName != undefined) {
      query.SubMenuName = values.SubMenuName
    }
    if (values.MenuName != '' && values.MenuName != null && values.MenuName != undefined) {
      query.MenuName = values.MenuName
    }
    console.log(query);
    const totalpage = await Menu.countDocuments(query)
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

    pipeline.unshift({
      $unwind: {
        path: "$subItems",
      },
    }, {
      $unwind: {
        path: "$subItems.subItems",
      },
    }, {
      $sort: {
        "subItems.subItems.orderBy": -1
      }
    }, {
      $project: {
        _id: 0,
        id: "$subItems.subItems.id",
        parentId: "$subItems.subItems.parentId",
        MenuName: "$label",
        Menuid: "$id",
        SubMenuId: "$subItems.id",
        SubMenuName: "$subItems.label",
        Link: "$link",
        name: "$subItems.subItems.label",
        icon: "$subItems.subItems.icon",
        isCollapsed:
          "$subItems.subItems.isCollapsed",
        isTitle: "$subItems.subItems.isTitle",
        badge: "$subItems.subItems.badge",
        orderBy: "$subItems.subItems.orderBy",
        status: '$subItems.subItems.status',
        Status: {
          $switch: {
            branches: [
              {
                case: {
                  $eq: ["$subItems.subItems.status", 0],
                },
                then: "Active",
              },
              {
                case: {
                  $eq: ["$subItems.subItems.status", 1],
                },
                then: "In Active",
              },
            ],
            default: "",
          },
        },
      },
    }, {
      $match: query
    });
    const Results = await Menu.aggregate(pipeline);
    if (Results.length > 0) {
      const Records = Results.map(({ id, status, ...rest }) => rest);
      let filePath = await Services.ExportCommonExcel(Records, "ChildMenu_list");
      var fullPublicUrl = process.env.fullPublicUrl;
      let downloadurl = `${fullPublicUrl}${filePath}`
      res.send({
        success: true,
        code: 200,
        status: "ChildMenu Lists retrieved successfully",
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
})

const ListAllMenu = catchAsync(async (req, res) => {
  try {

    const Results = await Menu.find({}, { _id: 0, "subItems._id": 0, "subItems.subItems._id": 0 }).sort({ orderBy: 1 }).lean().exec();
    if (Results.length > 0) {
      res.send({
        success: true,
        code: 200,
        status: "Data retrieved successfully",
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
})

module.exports = {
  AddMenu,
  UpdateMenu,
  DeleteMenu,
  ListMenu,
  AddSubMenu,
  UpdateSubMenu,
  DeleteSubMenu,
  ListSubMenu,
  AddChildMenu,
  UpdateChildMenu,
  DeleteChildMenu,
  ListChildMenu,
  ListAllMenu,
}