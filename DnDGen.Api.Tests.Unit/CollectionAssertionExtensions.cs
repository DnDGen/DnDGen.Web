namespace DnDGen.Api.Tests.Unit
{
    public static class CollectionAssertionExtensions
    {
        public static bool IsEquivalentTo<T>(this IEnumerable<T> source, IEnumerable<T> target)
        {
            if (source == null || target == null)
            {
                return source == target;
            }

            return source.Count() == target.Count()
                && !source.Except(target).Any();
        }

        public static bool IsEqualTo<T>(this IEnumerable<T> source, IEnumerable<T> target)
        {
            if (source == null || target == null)
            {
                return source == null && target == null;
            }

            var sourceArray = source!.ToArray();
            var targetArray = target!.ToArray();

            if (sourceArray.Length != targetArray.Length)
            {
                return false;
            }

            for (var i = 0; i < sourceArray.Length && i < targetArray.Length; i++)
            {
                if (!sourceArray[i].IsEqualTo(targetArray[i]))
                {
                    return false;
                }
            }

            return true;
        }

        private static bool IsEqualTo<T>(this T source, T target)
        {
            if (source == null || target == null)
            {
                return source == null && target == null;
            }

            return source.Equals(target);
        }
    }
}
