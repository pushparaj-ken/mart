const catchAsync = require('../../utils/catchAsync');
const logger1 = require('../../config/logger');
const CategoryModel = require('../../model/category')
const Services = require('../../services/excel')
const imageUpload = require('../../services/image_upload.service');
const foldername = "Category";

const AddCategory = catchAsync(async (req, res) => {
    try {
        const values = req.body;
        const files = req.files;
        console.log(values, "Values Data")
        if (values.name != '' && values.name != null && values.name != undefined) {
            const CategoryDetails = await CategoryModel.findOne({ status: 0, name: values.name })
            if (CategoryDetails != null) {
                res.send({
                    code: 201,
                    success: false,
                    status: "Category Already Exists!.",
                    timestamp: new Date()
                });
            } else {
                let image_new = "";
                if (files.image) {
                    let { buffer, originalname } = files.image[0];
                    let image = await imageUpload.upload(buffer, originalname, foldername);
                    console.log(image.Location, 'Testing For Locatiom');
                    image_new = image.Location;
                } else {
                    image_new = image_new;
                }
                const Data = {
                    name: values.name,
                    store_id: values.store_id,
                    image: image_new,
                    orderBy: values.orderBy,
                    show_on_homepage: values.show_on_homepage,
                    show_on_header: values.show_on_header,
                    highlight: values.highlight,
                    createdBy: req.userdetails.name,
                }
                CategoryModel(Data).save().then((Result) => {
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


const UpdateCategory = catchAsync(async (req, res) => {
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

            // console.log(ObjectId("65ba1dadf3904ece63c1647f"), "stating");
            const query = {
                id: params.id
            }
            const changes = {
                $set: values
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

const DeleteCategory = catchAsync(async (req, res) => {
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

const ListCategory = catchAsync(async (req, res) => {
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
            $match: query
        }, {
            $sort: {
                orderBy: -1
            }
        }, {
            $lookup: {
                from: "stores",
                localField: "store_id",
                foreignField: "id",
                as: "StoresDetails"
            }
        }, {
            $project: {
                id: 1,
                Name: "$name",
                Store_id: "$store_id",
                StoreName: {
                    $arrayElemAt: ["$StoreDetails.name", 0],
                },
                Image: "$image",
                ShowHeader: "$show_on_header",
                ShowPage: "$show_on_homepage",
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
    AddCategory,
    UpdateCategory,
    DeleteCategory,
    ListCategory,
}