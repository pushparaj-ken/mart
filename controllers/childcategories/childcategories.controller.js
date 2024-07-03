const catchAsync = require('../../utils/catchAsync');
const logger1 = require('../../config/logger');
const CategoryModel = require('../../model/category')
const Services = require('../../services/excel')
const imageUpload = require('../../services/image_upload.service');
const foldername = "ChildCategory";


const AddChildCategory = catchAsync(async (req, res) => {
    try {
        const values = req.body;
        const files = req.files;
        if (values.name != '' && values.name != null && values.name != undefined) {
            const CategoryDetails = await CategoryModel.findOne({ id: values.categoryid, 'subcategory.id': values.subcategoryid, status: 0, "subcategory.childcategory.name": values.name })
            if (CategoryDetails != null) {
                res.send({
                    code: 201,
                    success: false,
                    status: "ChildCategory Already Exists!.",
                    timestamp: new Date()
                });
            } else {
                let image_new = "";
                if (files.image) {
                    let { buffer, originalname } = files.image[0];
                    let image = await imageUpload.upload(buffer, originalname, foldername);
                    values.image = image.Location;
                } else {
                    values.image = image_new;
                }
                values.createdBy = req.userdetails.name;
                subcategoryid = { id: values.categoryid, 'subcategory.id': values.subcategoryid };
                delete values.categoryid
                delete values.subcategoryid
                const changes = {
                    $push: {
                        'subcategory.$.childcategory': [values],
                    },
                }
                CategoryModel.findOneAndUpdate(subcategoryid, changes).lean().exec().then((UpdateStatus) => {
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

const UpdateChildCategory = catchAsync(async (req, res) => {
    try {
        const values = req.body;
        const files = req.files;
        const params = req.params;
        if (params.id != '' && params.id != null && params.id != undefined) {
            let image_new = "";
            let responsejson = {}
            if (files.image) {
                let { buffer, originalname } = files.image[0];
                let image = await imageUpload.upload(buffer, originalname, foldername);
                console.log(image.Location);
                image_new = image.Location;
                responsejson['subcategory.$[sub].childcategory.$[child].image'] = image.Location
            }
            delete values.image
            values.updatedBy = req.userdetails.name
            const query = {
                id: values.categoryid,
                'subcategory.id': values.subcategoryid,
                'subcategory.childcategory.id': params.id
            };
            // Add other fields to update as needed
            for (const key in values) {
                responsejson['subcategory.$[sub].childcategory.$[child].' + key] = values[key]
            }
            console.log(responsejson)
            const changes = {
                $set: responsejson
            };
            const options = {
                arrayFilters: [
                    { 'sub.id': values.subcategoryid },
                    { 'child.id': params.id }
                ]
            };
            CategoryModel.findOneAndUpdate(query, changes, options).lean().exec().then((UpdateStatus) => {
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

const DeleteChildCategory = catchAsync(async (req, res) => {
    try {
        const params = req.params;
        const values = req.body;
        if (params.id != '' && params.id != null && params.id != undefined) {
            values.updatedBy = req.userdetails.name
            const query = {
                id: values.categoryid,
                'subcategory.id': values.subcategoryid,
                'subcategory.childcategory.id': params.id
            };
            // Add other fields to update as needed
            let responsejson = {}
            for (const key in values) {
                responsejson['subcategory.$[sub].childcategory.$[child].' + key] = values[key]
            }
            console.log(responsejson)
            const changes = {
                $set: {
                    'subcategory.$[sub].childcategory.$[child].status': values.status,
                    'subcategory.$[sub].childcategory.$[child].updatedBy': values.updatedBy,
                }
            };
            const options = {
                arrayFilters: [
                    { 'sub.id': values.subcategoryid },
                    { 'child.id': params.id }
                ]
            };
            CategoryModel.findOneAndUpdate(query, changes, options).lean().exec().then((UpdateStatus) => {
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

const ListChildCategory = catchAsync(async (req, res) => {
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
        if (values.SubCategoryName != '' && values.SubCategoryName != null && values.SubCategoryName != undefined) {
            query.SubCategoryName = values.SubCategoryName
        }
        if (values.CategoryName != '' && values.CategoryName != null && values.CategoryName != undefined) {
            query.CategoryName = values.CategoryName
        }
        if (values.SubCategoryid != '' && values.SubCategoryid != null && values.SubCategoryid != undefined) {
            query.SubCategoryid = values.SubCategoryid
        }
        if (values.Categoryid != '' && values.Categoryid != null && values.Categoryid != undefined) {
            query.Categoryid = values.Categoryid
        }
        console.log(query);
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
            $unwind: {
                path: "$subcategory.childcategory",
            },
        }, {
            $sort: {
                "subcategory.childcategory.orderBy": -1
            }
        }, {
            $project: {
                _id: 0,
                id: "$subcategory.childcategory.id",
                CategoryName: "$name",
                Categoryid: "$id",
                SubCategoryid: "$subcategory.id",
                SubCategoryName: "$subcategory.name",
                name: "$subcategory.childcategory.name",
                image: "$subcategory.childcategory.image",
                show_on_homepage:
                    "$subcategory.childcategory.show_on_homepage",
                orderBy: "$subcategory.childcategory.orderBy",
                show_on_header: "$subcategory.childcategory.show_on_header",
                status: '$subcategory.childcategory.status',
                Status: {
                    $switch: {
                        branches: [
                            {
                                case: {
                                    $eq: ["$subcategory.childcategory.status", 0],
                                },
                                then: "Active",
                            },
                            {
                                case: {
                                    $eq: ["$subcategory.childcategory.status", 1],
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
        const Results = await CategoryModel.aggregate(pipeline);
        if (Results.length > 0) {
            const Records = Results.map(({ id, status, ...rest }) => rest);
            let filePath = await Services.ExportCommonExcel(Records, "ChildCategory_list");
            var fullPublicUrl = process.env.fullPublicUrl;
            let downloadurl = `${fullPublicUrl}${filePath}`
            res.send({
                success: true,
                code: 200,
                status: "ChildCategory Lists retrieved successfully",
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
    AddChildCategory,
    UpdateChildCategory,
    DeleteChildCategory,
    ListChildCategory
}