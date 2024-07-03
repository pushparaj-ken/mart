const catchAsync = require('../utils/catchAsync');
const logger1 = require('../config/logger');
const product = require('../model/product')
const Category = require('../model/category') 
 
const Home = catchAsync(async (req, res) => {
  try {
    let values = req.query
    let query = {}
    if (values.category != '' && values.category != null && values.category != undefined) {
      query.id = values.category
    }
    if (values.highlight != '' && values.highlight != null && values.highlight != undefined) {
      query.highlight = values.highlight
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
          from: "products",
          let: {
            childcategory: "$childcategory",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $eq: [
                        "$subcategory.childcategory.id",
                        "$$childcategory",
                      ],
                    },
                    {
                      $eq: [
                        childcategory,
                        "$$childcategory",
                      ],
                    },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: "stores",
                localField: "store_id",
                foreignField: "id",
                as: "Stores",
              },
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
              $project: {
                _id: 0,
                id: 1,
                childcategory: 1,
                storeName: {
                  $arrayElemAt: ["$Stores.name", 0],
                },
                brandName: {
                  $arrayElemAt: ["$Brand.name", 0],
                },
                productname: 1,
                productfeaturedimage: 1,
                mrpprice: 1,
                sellingprice: 1,
              },
            },
          ],
          as: "Products",
        }
      },
      {
        $project: {
          _id: 0,
          id: 1,
          name: 1,
          image: 1,
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
                                              Products: {
                                                $filter: {
                                                  input: {
                                                    $map: {
                                                      input: "$Products",
                                                      as: "prod",
                                                      in: {
                                                        $cond: {
                                                          if: {
                                                            $eq: [
                                                              "$$prod.childcategory",
                                                              "$$child.id",
                                                            ],
                                                          },
                                                          then: "$$prod",
                                                          else: "",
                                                        },
                                                      },
                                                    },
                                                  },
                                                  as: "proddetails",
                                                  cond: {
                                                    $ne: [
                                                      "$$proddetails",
                                                      "",
                                                    ],
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
                                              Products: {
                                                $filter: {
                                                  input: {
                                                    $map: {
                                                      input: "$Products",
                                                      as: "prod",
                                                      in: {
                                                        $cond: {
                                                          if: {
                                                            $eq: [
                                                              "$$prod.childcategory",
                                                              "$$child.id",
                                                            ],
                                                          },
                                                          then: "$$prod",
                                                          else: "",
                                                        },
                                                      },
                                                    },
                                                  },
                                                  as: "proddetails",
                                                  cond: {
                                                    $ne: [
                                                      "$$proddetails",
                                                      "",
                                                    ],
                                                  },
                                                },
                                              },
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
                                              Products: {
                                                $filter: {
                                                  input: {
                                                    $map: {
                                                      input: "$Products",
                                                      as: "prod",
                                                      in: {
                                                        $cond: {
                                                          if: {
                                                            $eq: [
                                                              "$$prod.childcategory",
                                                              "$$child.id",
                                                            ],
                                                          },
                                                          then: "$$prod",
                                                          else: "",
                                                        },
                                                      },
                                                    },
                                                  },
                                                  as: "proddetails",
                                                  cond: {
                                                    $ne: [
                                                      "$$proddetails",
                                                      "",
                                                    ],
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
                                              Products: {
                                                $filter: {
                                                  input: {
                                                    $map: {
                                                      input: "$Products",
                                                      as: "prod",
                                                      in: {
                                                        $cond: {
                                                          if: {
                                                            $eq: [
                                                              "$$prod.childcategory",
                                                              "$$child.id",
                                                            ],
                                                          },
                                                          then: "$$prod",
                                                          else: "",
                                                        },
                                                      },
                                                    },
                                                  },
                                                  as: "proddetails",
                                                  cond: {
                                                    $ne: [
                                                      "$$proddetails",
                                                      "",
                                                    ],
                                                  },
                                                },
                                              },
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
  Home
}