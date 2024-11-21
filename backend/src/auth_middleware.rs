use chrono::Utc;
use actix_web::{
    dev::{Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage,
};
use futures::future::{ok, LocalBoxFuture, Ready};
use std::rc::Rc;
use std::task::{Context, Poll};

use crate::jwt::decode_jwt;

pub struct AuthMiddleware;

impl<S, B> Transform<S, ServiceRequest> for AuthMiddleware
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Transform = AuthMiddlewareService<S>;
    type InitError = ();
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(AuthMiddlewareService {
            service: Rc::new(service),
        })
    }
}

pub struct AuthMiddlewareService<S> {
    service: Rc<S>,
}

impl<S, B> Service<ServiceRequest> for AuthMiddlewareService<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    fn poll_ready(&self, ctx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(ctx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let srv = Rc::clone(&self.service);

        // Extract the Authorization header
        let auth_header = req.headers().get("Authorization").cloned();

        Box::pin(async move {
            if let Some(auth_header) = auth_header {
                if let Ok(auth_str) = auth_header.to_str() {
                    if auth_str.starts_with("Bearer ") {
                        let token = &auth_str[7..];

                        match decode_jwt(token) {
                            Ok(token_data) => {
                                let now = Utc::now();
                                if token_data.claims.exp < now.timestamp() as usize { // Token has expired
                                    eprintln!("Token expired");
                                    return Err(actix_web::error::ErrorUnauthorized("Token expired"));
                                }
                                // Store claims in request extensions
                                req.extensions_mut().insert(token_data.claims);
                                // Proceed to the next middleware or handler
                                return srv.call(req).await;
                            }
                            Err(err) => {
                                // Token is invalid
                                eprintln!("Token decoding error: {:?}", err);
                                return Err(actix_web::error::ErrorUnauthorized("Invalid token"));
                            }
                        }
                    }
                }
            }

            // No auth header or invalid format
            Err(actix_web::error::ErrorUnauthorized(
                "Authorization header missing or invalid",
            ))
        })
    }
}
