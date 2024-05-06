import Head from 'next/head';
import { Inter } from 'next/font/google';
import Table from 'react-bootstrap/Table';
import { Alert, Container } from 'react-bootstrap';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Pagination, TPaginationData } from '@/components';
import { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

const pageSize = 20;
const pageNeighbours = 1;

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerResponse = {
  users: TUserItem[];
  totalUsers: number;
};

export default function Home() {
  const [users, setUsers] = useState<TUserItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const getUsers = async (pageSize: number, pageNumber: number) => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `http://localhost:3000/users?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        { method: 'GET' }
      );

      if (!res.ok) {
        setUsers([]);
        setTotalUsers(0);
        return;
      }

      const responseJson = (await res.json()) as TGetServerResponse;

      setUsers(responseJson.users);
      setTotalUsers(responseJson.totalUsers);
    } catch (error) {
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers(pageSize, 1);
  }, []);

  const onPageChanged = (data: TPaginationData) => {
    getUsers(data.pageSize, data.pageNumber);
  };

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Pagination
            totalItems={totalUsers}
            pageSize={pageSize}
            pageNeighbours={pageNeighbours}
            isLoading={isLoading}
            onPageChanged={onPageChanged}
          />

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </main>
    </>
  );
}
