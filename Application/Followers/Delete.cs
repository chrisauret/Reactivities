using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class Delete //550
    {
        public class Command : IRequest
        {
            // The username of the user to unfollow
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;


            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;

                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // Current user
                var observer = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                // The follower
                var target = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                if (target == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });
                }

                var following = await _context.Followings.SingleOrDefaultAsync(
                        x => x.Observer.Id == observer.Id
                        && x.Target.Id == target.Id);

                if (following == null)
                    throw new RestException(HttpStatusCode.BadRequest, new { User = "You are not following this user" });

                if (following != null)
                {
                    _context.Followings.Remove(following);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}