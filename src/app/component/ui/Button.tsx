import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, FC } from "react";
import { inflateRaw } from "zlib";


  const buttonVariants = cva (
    'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium trasition- color :focus:outline-none focus:ring-2  foucus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    {
        variants :{
            variant :{
default :"bg-slate-900 text-white hover:bg-slate-800",
            ghost:"bg-trasparent hocer:text-slate-900 hover:bg-slate-200"
            }, 
            
            size :{
                default :'h-10 py-2 px-4',
                sm:'h-9 px-2',
                lg:'h-11 pz'
            }
        },
        defaultVariants :{
            variant :'default',
            size :'default'
        }
    }
  )

  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> ,VariantProps<typeof buttonVariants> {

  }
const Button: FC<ButtonProps> = ({className ,children ,variant ,isLoading ,size ,...props}) => {
    return (  
       <button className={cn(buttonVariants({variant ,size ,className}))} disabled={isLoading} {...props}>
{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
{children }

       </button>
    );
}
 
export default Button;