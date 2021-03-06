import { LoaderFunction, useLoaderData } from 'remix';
import invariant from 'tiny-invariant';
import PostList from '~/components/PostList';
import { getPosts, Post } from '~/ts/post-api';

type LoaderData = {
    tag: string;
    posts: Post[];
};

export const loader: LoaderFunction = async ({
    params,
}): Promise<LoaderData> => {
    const { tag } = params;
    const posts = await getPosts();
    invariant(typeof tag === 'string', 'No tag provided');
    return {
        tag,
        posts: posts.filter((p) => p.tags.includes(tag)),
    };
};

export default function Posts() {
    const { tag, posts } = useLoaderData<LoaderData>();
    return (
        <div>
            <h1 className="tag__title">
                Posts tagged with <span className="tag__tag">{tag}</span>
            </h1>
            <PostList posts={posts} />
        </div>
    );
}
