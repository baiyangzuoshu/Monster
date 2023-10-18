import { UnitState } from "../../Enum";

export default class UnitComponent  {
    public hp:number=0;
    public gold:number=0;
    
    public state:UnitState=UnitState.Normal;
}
