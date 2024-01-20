import React, {useEffect, useState} from "react";
import {IProductItem} from "./types.ts";
import {APP_ENV} from "../../../env";
import http_common from "../../../http_common.ts";
import {Button, Card, Table} from "antd";

const ProductsListPage: React.FC = () => {
    const [list, setList] = useState<IProductItem[]>();
    const imagePath = `${APP_ENV.BASE_URL}/upload/150_`;

    useEffect(() => {
        (async () => {
            const response = await http_common.get("/api/products");
            setList(response.data);
        })();
    }, []);

    return (
        <>
            <h1>Список Продуктів</h1>
            <div style={{ padding: '20px' }}>
                {list.map((item, index) => (
                    <Card
                        hoverable
                        style={{ width: 300 }}
                        cover={<img alt={item.name} src={item} />}
                    >
                        <div style={{ padding: '10px' }}>
                            <h3>{title}</h3>
                            <p>{description}</p>
                            <p>Price: ${price}</p>
                            <Button type="primary">Add to Cart</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
}

export default ProductsListPage;
