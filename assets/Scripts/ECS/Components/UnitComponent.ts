import { UnitState } from "../../Enum";

export default class UnitComponent  {
    public hp:number=0;
    public gold:number=0;
    public atk:number=0;
    public angle:number=0;
    public state:UnitState=UnitState.Normal;
    public m_attackTarget:cc.Node=null;
    public isDead:boolean=false;
    public m_bFire:boolean=false;
}
