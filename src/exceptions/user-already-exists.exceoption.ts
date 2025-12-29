import { HttpException, HttpStatus } from "@nestjs/common";

// Custom Exception Class
export class UserAlreadyExistsException extends HttpException {
    constructor(fieldName: string, fieldValue: string) {
        super(`User with ${fieldName} '${fieldValue}' already exists`, HttpStatus.CONFLICT);
    }
}