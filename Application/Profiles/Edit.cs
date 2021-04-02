using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Errors;
using System.Net;
using Microsoft.EntityFrameworkCore;
using Application.Interfaces;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command : IRequest
        {
            public string Username { get; set; }
            public string DisplayName { get; set; }
            public string Bio { get; set; }

            public class CommandValidator : AbstractValidator<Command>
            {
                public CommandValidator()
                {
                    RuleFor(x => x.DisplayName).NotEmpty();
                    RuleFor(x => x.Bio).NotEmpty();
                }
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
                    var user = await _context.Users.SingleOrDefaultAsync(x =>
                    x.UserName == _userAccessor.GetCurrentUsername());

                    if (user == null)
                    {
                        throw new RestException(HttpStatusCode.NotFound, new { user = "Not found" });
                    }

                    user.DisplayName = request.DisplayName;
                    user.Bio = request.Bio;

                    var success = await _context.SaveChangesAsync() > 0;

                    if (success) return Unit.Value;

                    throw new Exception("Problem updating user");
                }
            }
        }
    }
}