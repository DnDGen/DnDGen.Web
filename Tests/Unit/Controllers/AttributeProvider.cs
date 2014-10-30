using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace DNDGenSite.Tests.Unit.Controllers
{
    public static class AttributeProvider
    {
        public static IEnumerable<Type> GetAttributesFor(Controller controller, String methodName)
        {
            var type = controller.GetType();
            var methodInfo = type.GetMethod(methodName);

            if (methodInfo == null)
                return Enumerable.Empty<Type>();

            var methodAttributes = methodInfo.GetCustomAttributes(false);
            return methodAttributes.Select(a => a.GetType());
        }
    }
}