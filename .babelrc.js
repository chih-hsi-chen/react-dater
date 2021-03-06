module.exports = {
	plugins: [
		[
			'babel-plugin-transform-imports',
			{
				'@material-ui/core': {
					// Use "transform: '@material-ui/core/${member}'," if your bundler does not support ES modules
					transform: '@material-ui/core/esm/${member}',
					preventFullImport: true,
				},
				'@material-ui/icons': {
					// Use "transform: '@material-ui/icons/${member}'," if your bundler does not support ES modules
					transform: '@material-ui/icons/esm/${member}',
					preventFullImport: true,
				},
				'date-fns': {
					transform: 'date-fns/${member}',
					preventFullImport: true,
				},
			},
		],
	],
	env: {
		production: {
			plugins: [
				[
					'transform-react-remove-prop-types',
					{
						mode: 'remove',
						ignoreFilenames: ['node_modules'],
						removeImport: true,
					},
				],
			],
		},
	},
};
