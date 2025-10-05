export interface tempResponseDataType<T> {
 data: Data<T>;
 status: number;
}

interface Data<T> {
 data: boolean;
 result: Result<T>;
 status: string;
}

interface Result<T> {
 success: any;
 data: T;
}
