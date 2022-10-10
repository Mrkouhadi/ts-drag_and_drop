namespace App{
    // a decorator that helps us auto bind methods
    export const AutoBinder=(target:any, methodName: string | Symbol, descriptor: PropertyDescriptor):PropertyDescriptor => {
        const originalMethod = descriptor.value;
        return {
            configurable:true, // so that we can always change it
            enumerable:false,
            get(){
                return originalMethod.bind(this); // " this " refers whatever is triggering this method
            }
        }
    }
}