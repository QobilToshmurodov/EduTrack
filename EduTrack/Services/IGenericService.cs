namespace EduTrack.Services
{
    public interface IGenericService<T> where T : class
    {
        Task<T> Create(T model);
        Task<IEnumerable<T>> GetAll();
        Task<T> Get(int id);
        Task<T> Update(int id, T model);
        Task<bool> Delete(int id);
    }
}
