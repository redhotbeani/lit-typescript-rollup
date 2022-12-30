/* eslint-disable import/no-extraneous-dependencies */
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import litcss from 'rollup-plugin-lit-css';

const isStart = process.env.npm_lifecycle_event === 'start';
// build for production
const isBuild = process.env.npm_lifecycle_event === 'build';
const outputDir = isBuild ? `build` : 'dist';
const addSourceMap = !isBuild;

export default [
	{
		input: './index.ts',
		output: [
			{
				dir: outputDir,
				format: 'esm',
				sourcemap: addSourceMap,
			},
		],
		watch: {
			include: 'src/**'
		  },
		plugins: [
			litcss(),
			resolve({
				browser: true,
			}),
			typescript({
				tsconfig: './tsconfig.json',
				include: ['src/**/*'],
				sourceMap: addSourceMap,
				inlineSources: addSourceMap,
			}),
			babel({
				presets: ['@babel/preset-env'],
				babelHelpers: 'bundled',
				exclude: 'node_modules/**',
				include: ['src/**/*'],
			}),
			commonjs(),
			copy({
				targets: [
				  { src: 'static/index.html', dest: outputDir },
				]
			  }),
			...(isStart
				? [
					serve({
						// Launch in browser
						open: true,
						// Folder to serve files from
						contentBase: './',
						port: process.env.port || 8000,
						// Serve options
						openPage: `/${outputDir}/`,
					}),
					livereload({ watch: outputDir }),
				]
			: []),
		],
	},
];
