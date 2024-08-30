import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
  formatPaginationResponse = (list: Array<any>, limit: number) => {
    try {
        if (list.length == limit + 1) {
            list.pop();
            return {
                result: list,
                nextPageStatus: true,
            };
        } else {
            return {
                result: list,
                nextPageStatus: false,
            };
        }
    } catch (error) {
        console.log('Error in formatting pagination response', error);
        return {};
    }
};
}
