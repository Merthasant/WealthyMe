import { useGetAllAccount } from "@/lib/queries/account.query";

export default function AccountPage() {
  const { data, isLoading, isError } = useGetAllAccount();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>error</h1>;

  return (
    <section>
      <h1>Account Page</h1>
      {data &&
        data.data?.map((item) => (
          <div key={item.id}>
            <h1>{item.name}</h1>
            <h1>{item.balance}</h1>
            <h1>{item.currency_code}</h1>
            <h1>{item.type}</h1>
            <h1>{item.createdAt}</h1>
            <h1>{item.updatedAt}</h1>
          </div>
        ))}
    </section>
  );
}
