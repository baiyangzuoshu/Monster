import { UnitState } from "../../Enum";

export default class UnitComponent  {
    public angle:number=0;
    public monsterID:number=0;
    public isDead:boolean=false;
    public fireTime:number=0;
    public state:UnitState=UnitState.None;
}
