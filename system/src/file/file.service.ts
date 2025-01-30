import { Injectable } from '@nestjs/common';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileService {
    private readonly uploadPath = './uploads/avatars';

    constructor() {
        this.ensureUploadDirectoryExists();
    }

    private async ensureUploadDirectoryExists() {
        try {
            await fs.access(this.uploadPath);
        } catch {
            await fs.mkdir(this.uploadPath, { recursive: true });
        }
    }

    async saveFile(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new Error('No file provided');
        }

        const fileExtension = extname(file.originalname);
        const fileName = `avatar-${uuidv4()}${fileExtension}`;
        const filePath = path.join(this.uploadPath, fileName);

        try {
            await fs.writeFile(filePath, file.buffer);
            return fileName;
        } catch (error) {
            throw new Error(`Failed to save file: ${error.message}`);
        }
    }

    validateFile(mimetype: string): boolean {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        return allowedMimeTypes.includes(mimetype);
    }
}
