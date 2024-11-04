const Admin = require('../models/Admin');
const Product = require('../models/productModel'); // Import model Product
const multer = require('multer');

exports.getDashboard = async (req, res) => {
    try {
        const adminId = req.session.adminId; 
        if (!adminId) {
            return res.redirect('/login'); 
        }
        
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.redirect('/login');
        }
        
        // Render view dashboard với tên admin
        res.render('admin/dashboard', { adminName: admin.fullName }); // Chỉnh sửa phần này
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const adminName = req.admin ? req.admin.fullName : 'Admin'; // Sử dụng tên mặc định nếu không tìm thấy admin

        res.render('admin/manageProducts', { products, adminName });
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error.message);
        res.status(500).send('Lỗi máy chủ');
    }
};
exports.addProduct = (req, res) => {
    // Kiểm tra nếu file được gửi
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('Hình ảnh là bắt buộc!');
    }
    
    const { name, description, price, color, size, type, quantity } = req.body; // Thêm quantity vào đây
    const imagePaths = req.files.map(file => file.path); // Lấy đường dẫn hình ảnh

    const newProduct = new Product({
        name,
        description,
        price,
        color,
        size,
        type, // Lưu loại sản phẩm
        quantity, // Lưu số lượng
        images: imagePaths // Lưu đường dẫn hình ảnh vào database (thay đổi trường này trong schema nếu cần)
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    newProduct.save()
        .then(() => res.redirect('/admin/manageProducts'))
        .catch(err => res.status(500).send(err));
};

exports.showAddProductForm = (req, res) => {
    try {
        const adminName = req.admin ? req.admin.fullName : 'Admin'; // Lấy tên admin
        res.render('admin/addProduct', { adminName }); // Truyền adminName vào view
    } catch (error) {
        console.error("Lỗi khi render form thêm sản phẩm:", error.message);
        res.status(500).send('Lỗi máy chủ');
    }
};


// Hiển thị trang chỉnh sửa sản phẩm
exports.editProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Lấy ID sản phẩm từ tham số URL
        const product = await Product.findById(productId); // Tìm sản phẩm trong cơ sở dữ liệu

        // Lấy tên admin từ yêu cầu
        const adminName = req.admin ? req.admin.fullName : 'Admin';

        // Truyền tên admin và sản phẩm vào view
        res.render('admin/editProduct', { adminName, product });
    } catch (error) {
        console.error("Lỗi khi render form chỉnh sửa sản phẩm:", error.message);
        res.status(500).send('Lỗi máy chủ');
    }
};


exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, price, color, size, type, quantity } = req.body;

    // Tìm sản phẩm và cập nhật
    Product.findById(id)
        .then(product => {
            if (!product) {
                return res.status(404).send('Sản phẩm không tồn tại.');
            }

            // Cập nhật thông tin sản phẩm
            product.name = name;
            product.description = description;
            product.price = price;
            product.color = color;
            product.size = size;
            product.type = type;
            product.quantity = quantity;

            // Cập nhật hình ảnh nếu có
            if (req.file) {
                product.image = req.file.path; // Cập nhật hình ảnh
            }

            return product.save(); // Lưu thay đổi vào database
        })
        .then(() => res.redirect('/admin/manageProducts'))
        .catch(err => res.status(500).send(err));
};

exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id; // Lấy id sản phẩm từ request
        await Product.findByIdAndDelete(productId); // Xóa sản phẩm khỏi cơ sở dữ liệu
        res.redirect('/admin/manageProducts'); // Chuyển hướng về trang quản lý sản phẩm
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi khi xóa sản phẩm'); // Xử lý lỗi
    }
};
exports.getCustomers = (req, res) => {
    try {
        const adminName = req.admin ? req.admin.fullName : 'Admin'; // Sử dụng tên mặc định nếu không tìm thấy admin
        res.render('admin/manageCustomers', { adminName });
    } catch (error) {
        console.error("Lỗi khi render trang sản phẩm:", error.message);
        res.status(500).send('Lỗi máy chủ');
    }
};