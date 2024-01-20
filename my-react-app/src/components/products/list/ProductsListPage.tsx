import React, {useEffect, useState} from "react";
import {IProductImage, IProductItem} from "./types.ts";
import type {ColumnsType} from "antd/es/table";
import {Button, Table} from "antd";
import http_common from "../../../http_common.ts";
import {APP_ENV} from "../../../env";
import {Link} from "react-router-dom";

const ProductsListPage : React.FC = () => {
    const [list, setList] = useState<IProductItem[]>(
        [
            // {
            //     id: 1,
            //     name: "Ковбаса",
            //     image: "https://images.unian.net/photos/2023_04/1682361642-2646.jpg?r=989872"
            // }
        ]
    );
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const imagePath = `${APP_ENV.BASE_URL}/upload/150_`;

    const columns: ColumnsType<IProductItem> = [
        {
            title: "#",
            dataIndex: "id",
        },
        {
            title: "Назва",
            dataIndex: "name",
        },
        {
            title: "Ціна",
            dataIndex: "price",
        },
        {
            title: "Фото",
            dataIndex: "product_images",
            render: (images: IProductImage[]) => {
                const content = images.map((image, index) => (
                    <img
                        key={index}
                        src={`${imagePath}${image.name}`}
                        alt="фото"
                        width={100}
                        style={{ display: index === currentImageIndex ? "block" : "none" }}
                    />

                ));
                return <>{content}</>;
            },
        },
        {
            title: "Додатково",
            dataIndex: "product_images",
            render: (images: IProductImage[]) => {
                const buttons = images.map((_, index) => (
                    <Button
                        key={index}
                        type="default"
                        onClick={() => setCurrentImageIndex(index)}
                    >
                        {index + 1}
                    </Button>
                ));
                return <>{buttons}</>;
            },
        },
    ];

    useEffect(()=>{
        //console.log("useEffect working");
        http_common.get<IProductItem[]>("/api/products")
            .then(resp=> {
                //console.log("Axios result", resp.data);
                setList(resp.data);
            });
    },[]);

    return (
        <>
            <h1>Список товарів</h1>
            {/* Use the Link component from react-router-dom */}
            <Link to="/create">
                {/* Use the Button component from antd */}
                <Button type="primary">
                    Додати товар
                </Button>
            </Link>
            <Table columns={columns} rowKey={"id"} dataSource={list} size={"middle"} />
        </>
    )
}

export default ProductsListPage;
