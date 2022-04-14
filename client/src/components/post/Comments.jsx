import Comment from "./Comment";

export default function Comments({ comments }) {
	return (
		<div className="comments">
			{comments.map((comm) => (
				<Comment key={comm._id} comm={comm} />
			))}
		</div>
	);
}
