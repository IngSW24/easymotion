export interface CustomRequest extends Request {
  isWebAuth: boolean;
  [key: string]: any;
}
