import { MemoryRouter, Routes, Route } from 'react-router-dom';

type RouteConfig = {
  path?: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  errorElement?: React.ReactNode;
};

export const createTestRouter = (routeConfigs: RouteConfig[], initialRoute: string) => {
  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        {routeConfigs.map((routeConfig, index) => (
          <Route key={index} path={routeConfig.path} element={routeConfig.element}>
            {routeConfig.children?.map((child, childIndex) => (
              <Route key={childIndex} path={child.path} element={child.element} />
            ))}
          </Route>
        ))}
      </Routes>
    </MemoryRouter>
  );
};