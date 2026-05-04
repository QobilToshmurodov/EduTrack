using System;
using BCrypt.Net;

class Program
{
    static void Main()
    {
        string password = "123456789";
        string hash = BCrypt.Net.BCrypt.HashPassword(password, 11);
        Console.WriteLine(hash);
    }
}
