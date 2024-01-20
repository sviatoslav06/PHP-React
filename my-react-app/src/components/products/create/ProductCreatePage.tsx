// @ts-ignore
import {Button, Divider, Form, Input, Upload, GetProp, message, Alert, Modal} from "antd";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {PlusOutlined} from '@ant-design/icons';
import type {RcFile, UploadFile, UploadProps} from 'antd/es/upload/interface';
import {IProductImage, IProductItem} from "./types.ts";
import http_common from "../../../http_common.ts";
import {ICategoryItem} from "../../categories/list/types.tsx";

const CategoryCreatePage = () => {

    const navigate = useNavigate();
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [errorMessage, setErrorMessage] = useState<string>("");

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            // @ts-ignore
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    const onFinish = async (values: any) => {
        console.log('Success:', values);
        console.log('files:', fileList);
        if(fileList==null) {
            setErrorMessage("Оберіть фото!");
            return;
        }
        const model : IProductItem = {
            name: values.name,
            description: values.description,
            price: values.price,
            quantity: values.quantity,
            category: values.category,
            product_images: fileList
        };
        try {
            await http_common.post("/api/products/create", model,{
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            navigate("/");
        }
        catch (ex) {
            message.error('Помилка створення категорії!');
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        name?: string;
        description?: string;
        price?: number;
        quantity?: number;
        category?: ICategoryItem;
        product_images?: IProductImage[];
    };

    const customDividerStyle = {
        borderTop: '2px solid #1890ff',
        margin: '5px 0 50px 0',
    };

    const beforeUpload = (file: RcFile) => {
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            message.error('Оберіть файл зображення!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Розмір файлу не повинен перевищувать 10MB!');
        }
        console.log("is select", isImage && isLt2M);
        return isImage && isLt2M;
    };

    return (
        <>
            <Divider style={customDividerStyle}>Оновити продукт</Divider>
            {errorMessage && <Alert message={errorMessage} style={{marginBottom: "20px"}} type="error" />}
            <Form
                name="basic"
                style={{maxWidth: 1000}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Назва"
                    name="name"
                    rules={[{required: true, message: 'Вкажіть назву продукту!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Опис"
                    name="description"
                    rules={[{required: true, message: 'Вкажіть опис продукту!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Ціна"
                    name="price"
                    rules={[{required: true, message: 'Вкажіть ціну продукту!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Кількість"
                    name="quantity"
                    rules={[{required: true, message: 'Вкажіть кількість продукту!'}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item<FieldType>
                    label="Категорія"
                    name="category"
                    rules={[{required: true, message: 'Вкажіть категорію продукту!'}]}
                >
                    <Input/>
                </Form.Item>


                <Upload
                    // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={() => false}
                    listType="picture-card"
                    fileList={fileList}
                    multiple
                    onPreview={handlePreview}
                    onChange={handleChange}
                    accept="image/*"
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Додати
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default CategoryCreatePage;
