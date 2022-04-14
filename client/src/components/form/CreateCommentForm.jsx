import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "react-bootstrap";
import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { http } from "../../lib/axios";

const schema = yup
	.object()
	.shape({
		name: yup.string().required(),
		comment: yup.string().required(),
	})
	.required();

const createComment = (postId, data) =>
	http({
		url: `/posts/${postId}/comments`,
		method: "POST",
		data,
	});
export default function CreateCommentForm({ onClose, postId, parent }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = useCallback(
		async (formValues) => {
			try {
				await toast.promise(
					createComment(postId, {
						...formValues,
						parent,
						post: postId,
					}),
					{
						loading: "Creating...",
						success: <b>New comment has been created!</b>,
						error: <b>Could not create the comment.</b>,
					}
				);
				reset();
				onClose?.();
			} catch (err) {
				console.error(err);
			}
		},
		[postId, parent, reset, onClose]
	);

	return (
		<form
			className="d-flex flex-column gap-3"
			onSubmit={handleSubmit(onSubmit)}
		>
			{!parent && <h3>Add a Comment</h3>}
			<div className="form-group">
				<input
					type="text"
					className="form-control"
					placeholder="Name"
					{...register("name")}
				/>
				{errors?.name && <p className="text-danger">{errors?.name?.message}</p>}
			</div>
			<div className="form-group">
				<textarea
					className="form-control"
					placeholder="Comment"
					{...register("comment")}
				/>
				{errors?.comment && (
					<p className="text-danger">{errors?.comment?.message}</p>
				)}
			</div>
			<Button style={{ alignSelf: "baseline" }} type="submit" variant="dark">
				Submit
			</Button>
		</form>
	);
}
