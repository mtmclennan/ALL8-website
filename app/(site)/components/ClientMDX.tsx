'use client';
import * as React from 'react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXRemote } from 'next-mdx-remote';

type Props = React.PropsWithChildren<{
  mdx: MDXRemoteSerializeResult;
  components?: Record<string, React.ComponentType<any>>;
}>;

export default function ClientMDX({ mdx, components }: Props) {
  return <MDXRemote {...mdx} components={components} />;
}
