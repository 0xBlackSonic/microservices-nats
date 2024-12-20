# Microservices with NodeJS, MongoDB, NATS, Docker y Kubernetes.

This is a small project on how to implement an event-driven microservices architecture with NodeJS and orchestrating all services with Docker and Kubernetes.

Communication between services uses a PubSub pattern implemented with NATS JetStream.

## Requirements

1. [Docker](https://www.docker.com/get-started/)
2. [Kubernetes](https://docs.docker.com/desktop/features/kubernetes/)
3. [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)
4. [Ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/)
5. [Skaffold](https://skaffold.dev/docs/install/)

_[ `ingress-nginx` uses port 80 any other service using this port must be stopped ]_

## Initial settings

### Create environment variables

In each deployment configuration file, the non-sensitive environment variables must be defined in plain text. In the case of sensitive data, the Kubernetes Secret object must be used.

To create the object run in a terminal:

```
kubectl create secret generic microservices-test \
  --from-literal=JWT_SECRET_KEY=secrete-key-value \
  --from-literal=REFRESH_SECRET_KEY=secret-key-value \
  --from-literal=SMTP_USERNAME=username \
  --from-literal=SMTP_PASSWORD=password
```

Check if everything is saved

```
kubectl describe secret microservices-test
```

### SMTP environment variables

Set your SMTP server configuration in the email deployment config file, for this example [Resend](https://resend.com/) was used.

### Add an alias to localhost in /etc/hosts

Add to the `/etc/hosts` file the next line:

```
127.0.0.1 microservices.local
```

## Run the project

The project is organized as a monorepo using the latest version of lerna, so to install all dependencies run `npm install` in the root path.

Once everything is installed run `npm start`.

Go to your browser and access to `https://microservices.local`.

_As the ingress-nginx certificate is self-signed, the browser does not recognize it as valid, you can continue by selecting `Advanced` and then `Proceed to microservices.local (unsafe)`, or in case this option is not shown you can directly type `thisisunsafe`._
