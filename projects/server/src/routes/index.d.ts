import Router from 'koa-router';
declare type IContext = {
    vailate: (checks: any) => void;
};
declare const router: Router<{}, IContext>;
export default router;
