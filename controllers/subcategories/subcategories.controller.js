const catchAsync = require('../../utils/catchAsync');
const logger1 = require('../../config/logger');
const CategoryModel = require('../../model/category')
const Services = require('../../services/excel')
const imageUpload = require('../../services/image_upload.service');
const foldername = "SubCategory";

const AddSubCategory = catchAsync(async (req, res) => {
    try {
        const values = req.body;
        const files = req.files;
        console.log(values, "Values Data")
        if (values.name != '' && values.name != null && values.name != undefined) {
            const SubCategoryDetails = await CategoryModel.findOne({ status: 0, "subcategory.name": values.name })
            if (SubCategoryDetails != null) {
                res.send({
                    code: 201,
                    success: false,
                    status: "Subcategory Already Exists!.",
                    timestamp: new Date()
                });
            } else {
                let image_new = "";
                if (files.image) {
                    let { buffer, originalname } = files.image[0];
                    let image = await imageUpload.upload(buffer, originalname, foldername);
                    console.log(image.Location, 'Testing For Locatiom');
                    values.image = image.Location;
                } else {
                    values.image = image_new;
                }
                values.createdBy = req.userdetails.name;
                const query = {
                    id: values.categoryid
                }
                const changes = {
                    $push: {
                        subcategory: [values]
                    }
                }
                CategoryModel.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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

const UpdateSubCategory = catchAsync(async (req, res) => {
    try {
        const values = req.body;
        const files = req.files;
        const params = req.params;
        if (params.id != '' && params.id != null && params.id != undefined) {
            let responsejson = {}
            let image_new = "";
            if (files.image) {
                let { buffer, originalname } = files.image[0];
                let image = await imageUpload.upload(buffer, originalname, foldername);
                console.log(image.Location);
                responsejson['subcategory.$.image'] = image.Location
            }
            delete values.image
            values.updatedBy = req.userdetails.name
            const query = {
                'subcategory.id': params.id
            };
            for (const key in values) {
                responsejson['subcategory.$.' + key] = values[key]
            }

            console.log("values", responsejson);
            const changes = {
                $set: responsejson
            };
            CategoryModel.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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

const DeleteSubCategory = catchAsync(async (req, res) => {
    try {
        const params = req.params;
        const values = req.body;
        if (params.id != '' && params.id != null && params.id != undefined) {
            const query = {
                'subcategory.id': params.id
            };
            let responsejson = {}
            for (const key in values) {
                responsejson['subcategory.$.' + key] = values[key]
            }
            const changes = {
                $set: {
                    'subcategory.$.status': values.status,
                    'subcategory.$.updatedBy': values.updatedBy,
                }
            };
            console.log(changes, "Testing");
            CategoryModel.findOneAndUpdate(query, changes).lean().exec().then((UpdateStatus) => {
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

const ListSubCategory = catchAsync(async (req, res) => {
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
        if (values.CategoryName != '' && values.CategoryName != null && values.CategoryName != undefined) {
            query.CategoryName = values.CategoryName
        }
        if (values.Categoryid != '' && values.Categoryid != null && values.Categoryid != undefined) {
            query.Categoryid = values.Categoryid
        }
        query.subcategory = { $ne: [] };
        const totalpage = await CategoryModel.countDocuments(query)
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
                path: "$subcategory",
            },
        }, {
            $sort: {
                "subcategory.orderBy": -1
            }
        }, {
            $project: {
                _id: 0,
                id: "$subcategory.id",
                CategoryName: "$name",
                Categoryid: "$id",
                name: "$subcategory.name",
                image: "$subcategory.image",
                show_on_homepage: "$subcategory.show_on_homepage",
                orderBy: "$subcategory.orderBy",
                show_on_header: "$subcategory.show_on_header",
                status: '$subcategory.status',
                Status: {
                    $switch: {
                        branches: [{
                            case: {
                                $eq: ["$subcategory.status", 0],
                            },
                            then: "Active",
                        },
                        {
                            case: {
                                $eq: ["$subcategory.status", 1],
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
        const Results = await CategoryModel.aggregate(pipeline);
        if (Results.length > 0) {
            const Records = Results.map(({ id, status, ...rest }) => rest);
            let filePath = await Services.ExportCommonExcel(Records, "Category_list");
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

module.exports = {
    AddSubCategory,
    UpdateSubCategory,
    DeleteSubCategory,
    ListSubCategory,
}