import React from 'react';
import { Helmet as ReactHelmet } from 'react-helmet-async';

/**
 * Simple wrapper around react-helmet-async to set page title and meta description.
 * Usage: <Helmet title="Page Title" description="Page description" />
 */
export default function Helmet({ title, description }) {
  return (
    <ReactHelmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
    </ReactHelmet>
  );
}
