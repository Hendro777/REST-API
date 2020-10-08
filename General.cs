using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics;

namespace REST_API
{
    public class General
    {
        public static string checkDirPath(string dirpath)
        {
            try
            {
                if ((dirpath[^1].Equals("/")) == false && (dirpath[^1].Equals(@"\") == false))
                {
                    dirpath += "/";
                }

                if (Directory.Exists(dirpath) == false)
                {
                    Directory.CreateDirectory(dirpath);
                    Console.Write("File Directory created for DB at: " + dirpath);
                }
            }
            catch (Exception e)
            {
                Debug.WriteLine(e.Message);
            }

            return dirpath;
        }
    }
}
