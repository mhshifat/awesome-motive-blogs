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
		title: yup.string().required(),
		content: yup.string().required(),
		date: yup.date().required(),
	})
	.required();

const createPost = (data) =>
	http({
		url: "/posts",
		method: "POST",
		data,
	});
export default function CreatePostForm({ onClose }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const onSubmit = useCallback(
		async (formValues) => {
			try {
				await toast.promise(createPost(formValues), {
					loading: "Creating...",
					success: <b>New post has been created!</b>,
					error: <b>Could not create the post.</b>,
				});
				onClose?.();
			} catch (err) {
				console.error(err);
			}
		},
		[onClose]
	);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<label className="form-group d-block">
				<b>Title</b>
				<input type="text" className="form-control" {...register("title")} />
				{errors?.title && (
					<p className="text-danger">{errors?.title?.message}</p>
				)}
			</label>
			<label className="form-group d-block">
				<b>Content</b>
				<textarea className="form-control" {...register("content")} />
				{errors?.content && (
					<p className="text-danger">{errors?.content?.message}</p>
				)}
			</label>
			<label className="form-group d-block">
				<b>Date</b>
				<input
					type="date"
					className="form-control"
					{...register("date", { valueAsDate: true })}
				/>
				{errors?.date && <p className="text-danger">{errors?.date?.message}</p>}
			</label>

			<div className="d-flex justify-content-end mt-3" style={{ gap: "10px" }}>
				<Button variant="secondary" onClick={onClose}>
					Close
				</Button>
				<Button variant="primary" type="submit">
					Create
				</Button>
			</div>
		</form>
	);
}
