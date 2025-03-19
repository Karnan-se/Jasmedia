import { StatusCodes, ReasonPhrases } from "http-status-codes";

class AppError extends Error {
  constructor(
    errorMessage = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(errorMessage);
    this.errorMessage = errorMessage; 
    this.statusCode = statusCode; 

    Error.captureStackTrace(this, this.constructor);
  }

  static validation(message = ReasonPhrases.BAD_REQUEST) {
    return new AppError(message, StatusCodes.BAD_REQUEST);
  }

  static authentication(message = ReasonPhrases.UNAUTHORIZED) {
    return new AppError(message, StatusCodes.UNAUTHORIZED);
  }

  static forbidden(message = ReasonPhrases.FORBIDDEN) {
    return new AppError(message, StatusCodes.FORBIDDEN);
  }

  static conflict(message = ReasonPhrases.CONFLICT) {
    return new AppError(message, StatusCodes.CONFLICT);
  }
}

export default AppError;
