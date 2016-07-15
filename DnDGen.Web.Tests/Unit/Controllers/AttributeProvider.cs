using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace DnDGen.Web.Tests.Unit.Controllers
{
    public static class AttributeProvider
    {
        public static IEnumerable<Type> GetAttributesFor(Controller controller, string methodName)
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