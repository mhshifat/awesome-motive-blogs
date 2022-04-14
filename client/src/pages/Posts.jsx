import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Button, Card, Modal } from "react-bootstrap";
import CreatePostForm from "../components/form/CreatePostForm";
import { http } from "../lib/axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { setPosts } from "../store/slices/post";

const getPosts = () =>
	http({
		url: "/posts",
		method: "GET",
	});
export default function Posts() {
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const posts = useSelector((state) => state.posts.posts);

	useEffect(() => {
		getPosts().then(({ data }) => {
			dispatch(setPosts(data.data));
		});
	}, [dispatch]);

	return (
		<div className="container mt-5">
			<h1 className="d-flex justify-content-between align-items-center">
				All Posts
				<Button size="sm" onClick={() => setShow(true)}>
					+ Create Post
				</Button>
			</h1>

			<div
				className="row"
				style={{
					rowGap: "20px",
				}}
			>
				{posts.map((post) => (
					<div className="col-md-4" key={post._id}>
						<Link
							to={`/${post._id}`}
							style={{ color: "inherit", textDecoration: "none" }}
						>
							<Card>
								<Card.Body>
									<Card.Title>{post.title}</Card.Title>
									<Card.Subtitle
										style={{
											fontStyle: "italic",
											fontSize: "14px",
											color: "grey",
											marginBottom: "10px",
										}}
									>
										{moment(post.date).format("ll")}
									</Card.Subtitle>
									<Card.Text>{post.content}</Card.Text>
								</Card.Body>
							</Card>
						</Link>
					</div>
				))}
			</div>

			<Modal show={show} onHide={() => setShow(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Create a New Post</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<CreatePostForm
						onClose={() => {
							getPosts().then(({ data }) => {
								dispatch(setPosts(data.data));
								setShow(false);
							});
						}}
					/>
				</Modal.Body>
			</Modal>
		</div>
	);
}
