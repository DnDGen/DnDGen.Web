using System.Web.Mvc;
using EquipmentGen.Common;

namespace DNDGenSite.Controllers.Equipment
{
    public abstract class EquipmentController : Controller
    {
        protected JsonResult BuildJsonResult(Treasure treasure)
        {
            return Json(new { treasure = treasure }, JsonRequestBehavior.AllowGet);
        }
    }
}