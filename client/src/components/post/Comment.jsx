import moment from "moment";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { http } from "../../lib/axios";
import { getComments } from "../../pages/Post";
import CreateCommentForm from "../form/CreateCommentForm";
import Comments from "./Comments";

const getParentComments = (postId, commentId) =>
	http({
		url: `/posts/${postId}/comments/${commentId}/comments`,
		method: "GET",
	});
export default function Comment({ comm }) {
	const [comments, setComments] = useState([]);
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		if (!comm) return;
		getParentComments(comm.post, comm._id).then(({ data }) =>
			setComments(data.data)
		);
	}, [comm]);

	return (
		<div className="c-card">
			<Card>
				<Card.Body>
					<div className="d-flex gap-3">
						<div style={{ aspectRatio: "1/1", width: "50px" }}>
							<img
								src="https://picsum.photos/50"
								className="rounded-circle"
								alt=""
							/>
						</div>
						<div>
							<h3 className="text-primary">{comm.name}</h3>
							<h6 className="text-secondary" style={{ marginTop: "-10px" }}>
								{moment(comm.date).format("ll")}
							</h6>
						</div>
					</div>
					<p className="mt-2">{comm.comment}</p>

					{showForm ? (
						<Card style={{ maxWidth: "700px" }}>
							<Card.Body>
								<CreateCommentForm
									onClose={() => {
										getParentComments(comm.post, comm._id).then(({ data }) => {
											setComments(data.data);
											setShowForm(false);
										});
									}}
									postId={comm.post}
									parent={comm._id}
								/>
							</Card.Body>
						</Card>
					) : (
						<button
							onClick={() => setShowForm(true)}
							type="button"
							className="btn btn-ghost p-0 text-primary"
						>
							Reply
						</button>
					)}
				</Card.Body>
			</Card>
			{!!comments.length && <Comments comments={comments} />}
		</div>
	);
}
