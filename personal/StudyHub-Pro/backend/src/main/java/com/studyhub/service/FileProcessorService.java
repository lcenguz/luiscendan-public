package com.studyhub.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * FileProcessorService - Procesamiento de múltiples tipos de archivos
 * 
 * Soporta: PDF, imágenes (con OCR), PowerPoint, CSV, JSON, TXT
 */
@Service
public class FileProcessorService {

    /**
     * Procesa un archivo y extrae su contenido de texto
     */
    public String processFile(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        String fileType = getFileExtension(fileName);

        switch (fileType.toLowerCase()) {
            case "pdf":
                return processPDF(file);
            case "pptx":
            case "ppt":
                return processPowerPoint(file);
            case "jpg":
            case "jpeg":
            case "png":
            case "gif":
                return processImage(file);
            case "csv":
                return processCSV(file);
            case "json":
                return processJSON(file);
            case "txt":
            case "md":
                return processText(file);
            default:
                throw new IOException("Tipo de archivo no soportado: " + fileType);
        }
    }

    /**
     * Procesa archivos PDF
     */
    private String processPDF(MultipartFile file) throws IOException {
        try (PDDocument document = org.apache.pdfbox.Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            // Añadir metadatos
            StringBuilder result = new StringBuilder();
            result.append("📄 DOCUMENTO PDF\n");
            result.append("Páginas: ").append(document.getNumberOfPages()).append("\n");
            result.append("─".repeat(50)).append("\n\n");
            result.append(text);

            return result.toString();
        }
    }

    /**
     * Procesa archivos PowerPoint
     */
    private String processPowerPoint(MultipartFile file) throws IOException {
        try (XMLSlideShow ppt = new XMLSlideShow(file.getInputStream())) {
            StringBuilder result = new StringBuilder();
            result.append("📊 PRESENTACIÓN POWERPOINT\n");
            result.append("Diapositivas: ").append(ppt.getSlides().size()).append("\n");
            result.append("─".repeat(50)).append("\n\n");

            List<XSLFSlide> slides = ppt.getSlides();
            for (int i = 0; i < slides.size(); i++) {
                result.append("═══ DIAPOSITIVA ").append(i + 1).append(" ═══\n\n");

                XSLFSlide slide = slides.get(i);
                for (XSLFShape shape : slide.getShapes()) {
                    if (shape instanceof XSLFTextShape) {
                        XSLFTextShape textShape = (XSLFTextShape) shape;
                        String text = textShape.getText();
                        if (text != null && !text.trim().isEmpty()) {
                            result.append(text).append("\n");
                        }
                    }
                }
                result.append("\n");
            }

            return result.toString();
        }
    }

    /**
     * Procesa imágenes (con OCR básico)
     * Nota: Para OCR completo, necesitarías Tesseract configurado
     */
    private String processImage(MultipartFile file) throws IOException {
        BufferedImage image = ImageIO.read(file.getInputStream());

        StringBuilder result = new StringBuilder();
        result.append("🖼️ IMAGEN\n");
        result.append("Dimensiones: ").append(image.getWidth()).append("x").append(image.getHeight()).append("\n");
        result.append("─".repeat(50)).append("\n\n");
        result.append("⚠️ Imagen cargada correctamente.\n");
        result.append("Para extraer texto de imágenes, configura Tesseract OCR.\n\n");
        result.append("Puedes preguntarle a la IA sobre esta imagen describiendo su contenido.");

        // Aquí podrías integrar Tesseract OCR:
        // try {
        // Tesseract tesseract = new Tesseract();
        // tesseract.setDatapath("path/to/tessdata");
        // tesseract.setLanguage("spa");
        // String ocrText = tesseract.doOCR(image);
        // result.append("\n\nTexto extraído:\n").append(ocrText);
        // } catch (TesseractException e) {
        // result.append("\n\nError en OCR: ").append(e.getMessage());
        // }

        return result.toString();
    }

    /**
     * Procesa archivos CSV
     */
    private String processCSV(MultipartFile file) throws IOException {
        StringBuilder result = new StringBuilder();
        result.append("📊 ARCHIVO CSV\n");
        result.append("─".repeat(50)).append("\n\n");

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            int lineCount = 0;
            int maxPreviewLines = 50; // Limitar preview

            while ((line = reader.readLine()) != null && lineCount < maxPreviewLines) {
                result.append(line).append("\n");
                lineCount++;
            }

            if (lineCount >= maxPreviewLines) {
                result.append("\n... (archivo truncado, mostrando primeras ").append(maxPreviewLines)
                        .append(" líneas)\n");
            }

            result.append("\n📈 Total de líneas procesadas: ").append(lineCount);
        }

        return result.toString();
    }

    /**
     * Procesa archivos JSON
     */
    private String processJSON(MultipartFile file) throws IOException {
        StringBuilder result = new StringBuilder();
        result.append("📋 ARCHIVO JSON\n");
        result.append("─".repeat(50)).append("\n\n");

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            StringBuilder jsonContent = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonContent.append(line).append("\n");
            }

            // Formatear JSON (básico)
            String formatted = formatJSON(jsonContent.toString());
            result.append(formatted);
        }

        return result.toString();
    }

    /**
     * Procesa archivos de texto plano
     */
    private String processText(MultipartFile file) throws IOException {
        StringBuilder result = new StringBuilder();
        result.append("📝 ARCHIVO DE TEXTO\n");
        result.append("─".repeat(50)).append("\n\n");

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            while ((line = reader.readLine()) != null) {
                result.append(line).append("\n");
            }
        }

        return result.toString();
    }

    /**
     * Formatea JSON de forma básica
     */
    private String formatJSON(String json) {
        // Implementación básica - podrías usar Jackson para mejor formato
        return json;
    }

    /**
     * Obtiene la extensión del archivo
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    /**
     * Valida si el tipo de archivo es soportado
     */
    public boolean isSupportedFileType(String fileName) {
        String extension = getFileExtension(fileName).toLowerCase();
        return extension.matches("pdf|pptx?|jpe?g|png|gif|csv|json|txt|md");
    }

    /**
     * Obtiene información del archivo sin procesarlo completamente
     */
    public FileInfo getFileInfo(MultipartFile file) {
        FileInfo info = new FileInfo();
        info.setFileName(file.getOriginalFilename());
        info.setFileSize(file.getSize());
        info.setFileType(getFileExtension(file.getOriginalFilename()));
        info.setSupported(isSupportedFileType(file.getOriginalFilename()));
        return info;
    }

    // Clase auxiliar para información de archivo
    public static class FileInfo {
        private String fileName;
        private long fileSize;
        private String fileType;
        private boolean supported;

        // Getters y Setters
        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public long getFileSize() {
            return fileSize;
        }

        public void setFileSize(long fileSize) {
            this.fileSize = fileSize;
        }

        public String getFileType() {
            return fileType;
        }

        public void setFileType(String fileType) {
            this.fileType = fileType;
        }

        public boolean isSupported() {
            return supported;
        }

        public void setSupported(boolean supported) {
            this.supported = supported;
        }

        public String getFileSizeFormatted() {
            if (fileSize < 1024)
                return fileSize + " B";
            if (fileSize < 1024 * 1024)
                return String.format("%.2f KB", fileSize / 1024.0);
            return String.format("%.2f MB", fileSize / (1024.0 * 1024.0));
        }
    }
}
