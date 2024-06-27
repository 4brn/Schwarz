import { useFetcher, useLoaderData } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { XIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { getUser } from "@/App";
import { Button } from "@/components/ui/button";
import { PointI, DataI, SquareType } from "@/lib/types";

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
	const resMap = await fetch("http://localhost:12345/stores/0/layout");
	const dataMap = await resMap.json();
	return { dataMap };
}

export async function action({ request }: any) {
	const formData = await request.formData();
	let products = formData.get("products");
	console.log(products);
	const resPath = await fetch("http://localhost:12345/stores/0/find-route", {
		method: "POST",
		body: products,
	});
	const dataPath = await resPath.json();
	return { dataPath };
}

const GOLDEN = [170, 130, 240, 119, 239];

const Grid = ({ gridData }: { gridData: DataI[][] }) => {
	const [pathStops, setPathStops] = useState(0);
	const [gridD, setGridD] = useState(gridData);

	const user = getUser();
	const fetcher = useFetcher();

	useEffect(() => {
		const currentPath = fetcher.data?.dataPath.path as PointI[];
		for (let i = 0; i < currentPath?.length; i++) {
			let el = gridData[currentPath[i].y][currentPath[i].x];
			if (i === 0) el.kind = SquareType.START;
			else if (el.kind === SquareType.PRODUCT) {
				el.kind = SquareType.PRODUCT_VISITED;
			} else if (el.kind === SquareType.CHECKOUT) {
				el.kind = SquareType.CHECKOUT_VISITED;
			} else if (el.kind === SquareType.SELFCHECKOUT) {
				el.kind = SquareType.SELFCHECKOUT_VISITED;
			} else {
				el.kind = SquareType.VISITED;
			}
		}
	}, [fetcher, pathStops]);

	console.log(gridData);

	const grid = gridD.map((row, rowIndex) => (
		<div key={rowIndex} className="flex flex-1 w-full">
			{row.map((cell, colIndex) => (
				<motion.div
					key={colIndex}
					className={` md:m-1 m-[1px] flex-1 shadow-md round-[${Math.floor(
						Math.random() * 20
					)}]  ${getColorFromKind(cell.kind)}`}
				/>
			))}
		</div>
	));

	return (
		<div className="flex justify-center items-center h-full">
			<div className="grid grid-cols-1 lg:grid-cols-4 w-full md:min-h-[80vh]">
				<div className="col-span-1 flex md:flex-col justify-center items-center">
					<h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
						Продукти
					</h2>
					<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
						{user.cart.map((p) => {
							return (
								<li>
									{p.name}
									<XIcon
										className="inline size-4 cursor-pointer"
										onClick={() => user.removeFromCart(p.id)}
									/>
								</li>
							);
						})}
					</ul>
					<div className="flex justify-between w-1/4">
						<ArrowLeft
							onClick={() => {
								if (pathStops > 0) {
									setPathStops((prevState) => prevState - 1);
								}
							}}
							className="inline size-8 font-bold cursor-pointer"
						/>
						<ArrowRight
							onClick={() => {
								if (pathStops < user.cart.length + 1 + 1) {
									// 1 GOLDEN egg, 1 checkout
									setPathStops((prevState) => prevState + 1);
								}
							}}
							className="inline size-8 font-bold cursor-pointer"
						/>
					</div>
					<fetcher.Form method="post">
						<Button
							disabled={user.cart.length === 0}
							name="products"
							value={JSON.stringify({ products: user.cart.map((p) => p.id) })}
						>
							Намери пътя към светлината!
						</Button>
					</fetcher.Form>
				</div>
				<div className="col-span-3 flex flex-col items-center justify-center p-5 h-[60vw] max-h-[80vh]">
					{grid}
					<h1 className="hidden md:hidden">{0}</h1>
				</div>
			</div>
		</div>
	);
};

const getColorFromKind = (kind: number) => {
	switch (kind) {
		case SquareType.EMPTY:
			return "dark:bg-white dark:opacity-30 bg-transparent";
		case SquareType.EXIT:
			return `bg-red-500`;
		case SquareType.BLOCAKDE:
			return "bg-gray-500";
		case SquareType.PRODUCT:
			return "bg-yellow-500";
		case SquareType.CHECKOUT:
			return "bg-purple-500";
		case SquareType.SELFCHECKOUT:
			return "bg-pink-500";
		case SquareType.VISITED:
			return "bg-cyan-500";
		case SquareType.PRODUCT_VISITED:
			return "bg-yellow-200";
		case SquareType.CHECKOUT_VISITED:
			return "bg-purple-200";
		case SquareType.SELFCHECKOUT_VISITED:
			return "bg-pink-200";
		case SquareType.START:
			return "bg-green-500";
		default:
			return "bg-gray-300";
	}
};

export function Map() {
	const { dataMap } = useLoaderData() as {
		dataMap: DataI[][];
	};

	return (
		<>
			<Grid gridData={dataMap} />
			<canvas id="map" className="hidden"></canvas>
		</>
	);
}
