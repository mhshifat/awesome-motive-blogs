import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Comments from "../components/post/Comments";
import { http } from "../lib/axios";
import CreateCommentForm from "../components/form/CreateCommentForm";
import { useDispatch, useSelector } from "react-redux";
import { setComments, setPost } from "../store/slices/post";

const getPost = (postId) =>
	http({
		url: `/posts/${postId}`,
		method: "GET",
	});

export const getComments = (postId) =>
	http({
		url: `/posts/${postId}/comments`,
		method: "GET",
	});
export default function Post() {
	const dispatch = useDispatch();
	const { id: postId } = useParams();
	const post = useSelector((state) => state.posts.post);
	const comments = useSelector((state) => state.posts.comments);

	useEffect(() => {
		if (!postId) return;
		getPost(postId).then(({ data }) => dispatch(setPost(data.data)));
		getComments(postId).then(({ data }) => dispatch(setComments(data.data)));
	}, [dispatch, postId]);

	return (
		<div className="container mt-5 pb-5">
			<h1 className="d-flex justify-content-between align-items-center">
				Post: {postId}
			</h1>
			<hr />
			<br />
			<h3>{post?.title}</h3>
			<p style={{ maxWidth: "700px" }}>{post?.content}</p>

			<br />
			<Card style={{ maxWidth: "700px" }}>
				<Card.Body>
					<CreateCommentForm
						onClose={() => {
							getComments(postId).then(({ data }) =>
								dispatch(setComments(data.data))
							);
						}}
						postId={postId}
					/>
				</Card.Body>
			</Card>
			<br />
			<Comments comments={comments} />
		</div>
	);
}
