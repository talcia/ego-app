/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack(config, options) {
		config.module.rules.push({
			test: /\.svg$/,
			use: [
				{
					loader: 'url-loader',
					options: {
						limit: 8192, // Adjust the limit as needed
						name: '[name].[hash].[ext]',
						publicPath: '/_next/static/images/',
						outputPath: 'static/images/',
					},
				},
			],
		});

		return config;
	},
	reactStrictMode: true,
};

export default nextConfig;
