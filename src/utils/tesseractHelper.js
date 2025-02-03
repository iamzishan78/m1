/* eslint-disable no-await-in-loop */
// import Tesseract from 'tesseract.js';

const readFile = async file => {
	return new Promise(resolve => {
		const reader = new FileReader();
		reader.addEventListener('loadend', event => resolve(new Uint8Array(event.target.result)));
		reader.readAsArrayBuffer(file);
	});
};

const convertToImage = async pdf => {
	const images = [];
	for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
		const page = await pdf.getPage(pageNumber);
		const viewport = page.getViewport({ scale: 1.5 });
		const canvas = document.createElement('canvas');
		canvas.height = viewport.height;
		canvas.width = viewport.width;
		await page.render({
			canvasContext: canvas.getContext('2d'),
			viewport: viewport,
		}).promise;
		images.push(canvas.toDataURL('image/png'));
	}
	return images;
};

// eslint-disable-next-line no-unused-vars
const convertToText = async (images, language, setFileContent) => {
	// const worker = await Tesseract.createWorker();
	// await worker.loadLanguage(language);
	// await worker.initialize(language);

	const texts = [];
	// for (const image of images) {
	// 	const {
	// 		data: { text },
	// 	} = await worker.recognize(image);
	// 	texts.push(text);

	// 	setFileContent?.([...texts]);
	// }

	// await worker.terminate();

	return texts;
};

const loadFile = async file => window.pdfjsLib.getDocument({ data: file }).promise;

export const convertFile = async (
	fileInput,
	onDone,
	language = localStorage.getItem('language') || 'eng',
	{ setLoading, setError, setFileContent } = {}
) => {
	setLoading?.(true);
	setError?.(null);

	let texts = null;

	try {
		const file = await readFile(fileInput);
		const pdf = await loadFile(file);
		const images = await convertToImage(pdf);
		texts = await convertToText(images, language, setFileContent);

		onDone(texts);
	} catch (error) {
		setError?.(error.message);
		return null;
	} finally {
		setLoading?.(false);
	}

	return texts;
};
