const fs = require('fs');
const path = require('path');

// Directory to scan (adjust as needed)
const rootDir = path.resolve(__dirname, 'src');

// Regex to detect JSX syntax
const jsxRegex = /<[^>]+>/;

// Function to scan and process files
const renameJsToJsx = dir => {
	const files = fs.readdirSync(dir);

	files.forEach(file => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			// Recursively process subdirectories
			renameJsToJsx(filePath);
		} else if (path.extname(file) === '.js') {
			// Check if the file contains JSX
			const content = fs.readFileSync(filePath, 'utf-8');
			if (jsxRegex.test(content)) {
				const newFilePath = filePath.replace(/\.js$/, '.jsx');
				fs.renameSync(filePath, newFilePath);
				console.log(`Renamed: ${filePath} -> ${newFilePath}`);
			}
		}
	});
};

// Run the script
renameJsToJsx(rootDir);
